/**
 * Public Sanity env. Missing/placeholder values disable live CMS fetches
 * so the site can run on sample insights.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

const PLACEHOLDER_IDS = new Set(["", "your-project-id", "placeholder"]);

export const isSanityConfigured = !PLACEHOLDER_IDS.has(projectId.trim());
