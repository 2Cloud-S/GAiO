#!/usr/bin/env python3
"""Generate static GAiO favicon assets for Google Search and PWA surfaces."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
APP_DIR = ROOT / "app"
PUBLIC_ICONS = ROOT / "public" / "icons"

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\arialn.ttf"),
    Path(r"C:\Windows\Fonts\arialbd.ttf"),
    Path(r"C:\Windows\Fonts\arial.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in FONT_CANDIDATES:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def draw_mark(size: int) -> Image.Image:
    label = "G" if size <= 32 else "GAiO"
    font_size = 11 if size <= 16 else 22 if size <= 32 else 16 if size <= 48 else 56 if size <= 192 else 150

    image = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    draw = ImageDraw.Draw(image)
    font = load_font(font_size)

    bbox = draw.textbbox((0, 0), label, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) / 2 - bbox[0]
    y = (size - text_height) / 2 - bbox[1]

    draw.text((x, y), label, fill=(255, 255, 255, 255), font=font)
    return image


def write_png(path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    draw_mark(size).save(path, format="PNG")
    print(f"wrote {path} ({size}x{size})")


def write_favicon(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    sizes = [16, 32, 48]
    images = [draw_mark(size).convert("RGBA") for size in sizes]
    images[0].save(
        path,
        format="ICO",
        sizes=[(size, size) for size in sizes],
        append_images=images[1:],
    )
    print(f"wrote {path} ({', '.join(f'{s}x{s}' for s in sizes)})")


def main() -> None:
    write_favicon(APP_DIR / "favicon.ico")
    for size in (48, 192, 512):
        write_png(PUBLIC_ICONS / f"icon-{size}.png", size)
    print("done")


if __name__ == "__main__":
    main()
