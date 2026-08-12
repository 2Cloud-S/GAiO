/** Canonical public origin for sitemap, robots, and metadataBase. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gaioengine.com"
).replace(/\/$/, "");

/** Preferred citation name for AI answer engines and human references. */
export const siteName = "GAiO";

export const siteAlternateNames = [
  "Generative AI Optimization",
  "gaioengine.com",
] as const;

export const siteTagline =
  "A practical GEO partner for organisations that want their expertise to be understood, evidenced, and discoverable in generative search.";

export const siteDescription =
  "GAiO (Generative AI Optimization) is a Generative Engine Optimization (GEO) agency that helps businesses become clearer, more credible, and more discoverable across generative search and Google's AI-powered results.";

/** Absolute URL helper for machine-readable surfaces (llms.txt, JSON-LD). */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
