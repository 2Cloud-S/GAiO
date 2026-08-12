import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const disallow = ["/studio/", "/api/"] as const;

/** Shared allow policy for search + major AI crawlers (AEO citation readiness). */
const sharedRule = {
  allow: "/",
  disallow: [...disallow],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...sharedRule },
      { userAgent: "GPTBot", ...sharedRule },
      { userAgent: "ChatGPT-User", ...sharedRule },
      { userAgent: "Google-Extended", ...sharedRule },
      { userAgent: "PerplexityBot", ...sharedRule },
      { userAgent: "ClaudeBot", ...sharedRule },
      { userAgent: "anthropic-ai", ...sharedRule },
      { userAgent: "Bingbot", ...sharedRule },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
