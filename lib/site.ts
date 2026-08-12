/** Canonical public origin for sitemap, robots, and metadataBase. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gaioengine.com"
).replace(/\/$/, "");
