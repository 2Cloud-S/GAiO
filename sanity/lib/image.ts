import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  return builder.image(source).auto("format").fit("max");
}
