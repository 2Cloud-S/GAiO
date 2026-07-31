import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

type ImageBuilder = NonNullable<ReturnType<typeof urlForImage>>;

/** True when @sanity/image-url can resolve a CDN URL (has asset ref/id/url, or is an id/url string). */
function isResolvableImageSource(source: SanityImageSource): boolean {
  if (typeof source === "string") return source.length > 0;
  if (typeof source !== "object" || source === null) return false;

  const s = source as Record<string, unknown>;

  if (typeof s._ref === "string") return true;
  if (typeof s._id === "string") return true;

  // In-progress Studio uploads — library returns a tiny placeholder PNG
  if (s._upload) return true;

  const asset = s.asset;
  if (asset && typeof asset === "object") {
    const a = asset as Record<string, unknown>;
    return (
      typeof a._ref === "string" ||
      typeof a._id === "string" ||
      typeof a.url === "string"
    );
  }

  return false;
}

/**
 * Returns an image URL builder, or null when Sanity isn't configured or the
 * source has no resolvable asset (e.g. alt-only image stub).
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!builder || !source || !isResolvableImageSource(source)) return null;
  return builder.image(source).auto("format").fit("max");
}

/**
 * Build a final image URL without throwing when the asset is missing or invalid.
 */
export function resolveImageUrl(
  source: SanityImageSource | null | undefined,
  transform?: (b: ImageBuilder) => ImageBuilder,
): string | null {
  try {
    const base = urlForImage(source);
    if (!base) return null;
    const built = transform ? transform(base) : base;
    return built.url() || null;
  } catch {
    return null;
  }
}
