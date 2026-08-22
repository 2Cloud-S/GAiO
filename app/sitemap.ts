import type { MetadataRoute } from "next";
import { blogHref, blogListingHref } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { getInsightPosts } from "@/sanity/lib/posts";

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const staticRoutes: StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/methodology", changeFrequency: "monthly", priority: 0.8 },
  { path: "/proof", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.5 },
  { path: blogListingHref, changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/assessment", changeFrequency: "monthly", priority: 0.7 },
  { path: "/book", changeFrequency: "monthly", priority: 0.8 },
];

function postLastModified(post: {
  publishedAt: string | null;
  updatedAt: string | null;
}): Date {
  const raw = post.updatedAt || post.publishedAt;
  return raw ? new Date(raw) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getInsightPosts();
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.3,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}${blogHref(post.slug)}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
