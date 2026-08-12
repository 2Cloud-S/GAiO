import { siteUrl } from "@/lib/site";

/**
 * Custom robots.txt so we can point crawlers at llms.txt
 * (MetadataRoute.Robots has no comment field).
 */
export function GET() {
  const body = [
    "# GAiO crawl policy",
    `# AI-oriented site summary: ${siteUrl}/llms.txt`,
    `# Expanded AI reference: ${siteUrl}/llms-full.txt`,
    `# Sitemap: ${siteUrl}/sitemap.xml`,
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "# Major AI crawlers — same public allow policy (citation / answer readiness).",
    "User-agent: GPTBot",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: anthropic-ai",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
