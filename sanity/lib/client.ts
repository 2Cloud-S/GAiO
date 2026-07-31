import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
}
