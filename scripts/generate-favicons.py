#!/usr/bin/env python3
"""Generate static GAiO favicon assets for Google Search and PWA surfaces.

Renders at high resolution, then downscales with LANCZOS for crisp edges.
Tab/favicon assets use a transparent background; the 512 maskable PWA icon
keeps an opaque dark fill for iOS/Android safe-zone requirements.
"""

from __future__ import annotations

import io
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
APP_DIR = ROOT / "app"
PUBLIC_ICONS = ROOT / "public" / "icons"

# Prefer bold condensed faces so marks stay dense after downscale.
FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\ARIALNB.TTF"),  # Arial Narrow Bold
    Path(r"C:\Windows\Fonts\arialbd.ttf"),
    Path(r"C:\Windows\Fonts\segoeuib.ttf"),
    Path(r"C:\Windows\Fonts\impact.ttf"),
    Path(r"C:\Windows\Fonts\arial.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]

SUPER_SCALE = 4
# Inset as a fraction of canvas so glyphs don't clip after downscale.
PAD_RATIO_G = 0.10
PAD_RATIO_WORD = 0.11


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in FONT_CANDIDATES:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def label_for(size: int) -> str:
    # Single "G" stays sharp through 48px (tabs + Google). Full wordmark above that.
    return "G" if size <= 48 else "GAiO"


def fit_font(label: str, canvas: int) -> ImageFont.ImageFont:
    """Largest bold font that fits label inside the padded square."""
    pad = PAD_RATIO_G if label == "G" else PAD_RATIO_WORD
    max_box = int(canvas * (1 - 2 * pad))
    lo, hi = 4, max(8, int(canvas * 0.98))
    best = load_font(lo)
    probe = ImageDraw.Draw(Image.new("RGBA", (canvas, canvas)))

    while lo <= hi:
        mid = (lo + hi) // 2
        font = load_font(mid)
        bbox = probe.textbbox((0, 0), label, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        if tw <= max_box and th <= max_box:
            best = font
            lo = mid + 1
        else:
            hi = mid - 1
    return best


def crisp_alpha(image: Image.Image, *, size: int) -> Image.Image:
    """Tighten soft antialias so tiny favicons read as ink, not fog."""
    if size > 64:
        return image.filter(ImageFilter.UnsharpMask(radius=1.6, percent=140, threshold=1))

    sharpened = image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=160, threshold=1))
    pixels = sharpened.load()
    assert pixels is not None
    width, height = sharpened.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a < 48:
                pixels[x, y] = (0, 0, 0, 0)
            elif a > 160:
                pixels[x, y] = (255, 255, 255, 255)
            else:
                # Pull mid alphas toward solid white ink.
                boosted = min(255, int(a * 1.45))
                pixels[x, y] = (255, 255, 255, boosted)
    return sharpened


def draw_mark(size: int, *, opaque: bool = False) -> Image.Image:
    """Render mark supersampled, then LANCZOS-downsample to `size`."""
    label = label_for(size)
    hi = size * SUPER_SCALE
    background = (10, 10, 10, 255) if opaque else (0, 0, 0, 0)

    image = Image.new("RGBA", (hi, hi), background)
    draw = ImageDraw.Draw(image)
    font = fit_font(label, hi)

    bbox = draw.textbbox((0, 0), label, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (hi - text_width) / 2 - bbox[0]
    y = (hi - text_height) / 2 - bbox[1]
    draw.text((x, y), label, fill=(255, 255, 255, 255), font=font)

    down = image.resize((size, size), Image.Resampling.LANCZOS)
    return crisp_alpha(down, size=size)


def write_png(path: Path, size: int, *, opaque: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    draw_mark(size, opaque=opaque).save(path, format="PNG", optimize=True)
    kind = "opaque" if opaque else "transparent"
    print(f"wrote {path} ({size}x{size}, {kind})")


def write_ico_png_frames(path: Path, images: list[Image.Image]) -> None:
    """Write a multi-size ICO with PNG-compressed frames (keeps alpha).

    Pillow's ``append_images`` path often collapses to a single 16x16 frame;
    assembling the container ourselves is reliable across Pillow versions.
    """
    frames: list[bytes] = []
    for image in images:
        buffer = io.BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        frames.append(buffer.getvalue())

    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    offset = 6 + 16 * count
    directory = bytearray()
    for image, payload in zip(images, frames, strict=True):
        width = 0 if image.width >= 256 else image.width
        height = 0 if image.height >= 256 else image.height
        directory.extend(
            struct.pack(
                "<BBBBHHII",
                width,
                height,
                0,
                0,
                1,
                32,
                len(payload),
                offset,
            )
        )
        offset += len(payload)

    path.write_bytes(header + directory + b"".join(frames))


def write_favicon(path: Path) -> None:
    """Multi-resolution ICO with embedded PNG frames (alpha retained)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    sizes = (16, 32, 48)
    images = [draw_mark(size, opaque=False) for size in sizes]
    write_ico_png_frames(path, images)
    print(f"wrote {path} ({', '.join(f'{s}x{s}' for s in sizes)}, transparent)")


def verify_ico(path: Path) -> None:
    data = path.read_bytes()
    count = data[4] | (data[5] << 8)
    frames: list[tuple[int, int]] = []
    cursor = 6
    for _ in range(count):
        width = data[cursor] or 256
        height = data[cursor + 1] or 256
        frames.append((width, height))
        cursor += 16
    print(f"verified {path} embeds: {frames}")


def main() -> None:
    write_favicon(APP_DIR / "favicon.ico")
    verify_ico(APP_DIR / "favicon.ico")
    write_png(PUBLIC_ICONS / "icon-48.png", 48, opaque=False)
    write_png(PUBLIC_ICONS / "icon-192.png", 192, opaque=False)
    # Maskable PWA icon needs an opaque fill + safe padding (handled by PAD_RATIO).
    write_png(PUBLIC_ICONS / "icon-512.png", 512, opaque=True)
    print("done")


if __name__ == "__main__":
    main()
