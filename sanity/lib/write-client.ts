import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Server-only client for mutations (likes, views, comments).
 * Requires SANITY_API_WRITE_TOKEN — never import this into client components.
 */
export function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!isSanityConfigured || !token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}

export function isWriteConfigured(): boolean {
  return Boolean(
    isSanityConfigured && process.env.SANITY_API_WRITE_TOKEN?.trim(),
  );
}
