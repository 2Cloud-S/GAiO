import type { MetadataRoute } from "next";
import { blogHref, blogListingHref } from "@/lib/content";
import { getInsightPosts } from "@/sanity/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://generativeaioptimization.example";
  const pages = ["", "/services", "/methodology", "/proof", blogListingHref, "/about", "/assessment", "/book"];
  const posts = await getInsightPosts();

  return [
    ...pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })),
    ...posts.map((post) => ({
      url: `${base}${blogHref(post.slug)}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    })),
  ];
}
