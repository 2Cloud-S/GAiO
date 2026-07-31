import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { articles, type Article } from "@/lib/content";
import { getClient } from "./client";
import { urlForImage } from "./image";
import {
  latestPostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsQuery,
} from "./queries";
import { isSanityConfigured } from "../env";

export type InsightPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt: string | null;
  likes: number;
  views: number;
  comments: number;
  imageUrl: string | null;
  body?: PortableTextBlock[] | string[];
  source: "sanity" | "sample";
};

type SanityPostDoc = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  author?: string | null;
  category?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  likes?: number | null;
  views?: number | null;
  comments?: number | null;
  mainImage?: SanityImageSource | null;
  body?: PortableTextBlock[] | null;
};

function sampleToInsight(article: Article, index: number): InsightPost {
  return {
    _id: `sample-${article.slug}`,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    author: "Signal / Proof",
    category: article.category,
    readTime: article.readTime,
    publishedAt: null,
    likes: 12 + index * 5,
    views: 120 + index * 40,
    comments: 2 + index,
    imageUrl: null,
    body: article.body,
    source: "sample",
  };
}

function mapSanityPost(doc: SanityPostDoc): InsightPost | null {
  if (!doc?.slug || !doc.title) return null;
  return {
    _id: doc._id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? "",
    author: doc.author ?? "Signal / Proof",
    category: doc.category ?? "Insight",
    readTime: doc.readTime ?? "5 min read",
    publishedAt: doc.publishedAt ?? null,
    likes: doc.likes ?? 0,
    views: doc.views ?? 0,
    comments: doc.comments ?? 0,
    imageUrl: urlForImage(doc.mainImage)?.width(640).height(640).url() ?? null,
    body: doc.body ?? undefined,
    source: "sanity",
  };
}

async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.warn("[sanity] fetch failed, using sample insights", error);
    return null;
  }
}

export async function getInsightPosts(): Promise<InsightPost[]> {
  if (isSanityConfigured) {
    const docs = await fetchSanity<SanityPostDoc[]>(postsQuery);
    if (docs?.length) {
      return docs.map(mapSanityPost).filter((p): p is InsightPost => Boolean(p));
    }
  }
  return articles.map(sampleToInsight);
}

export async function getLatestInsightPosts(limit = 3): Promise<InsightPost[]> {
  if (isSanityConfigured) {
    const docs = await fetchSanity<SanityPostDoc[]>(latestPostsQuery);
    if (docs?.length) {
      return docs
        .map(mapSanityPost)
        .filter((p): p is InsightPost => Boolean(p))
        .slice(0, limit);
    }
  }
  return articles.slice(0, limit).map(sampleToInsight);
}

export async function getInsightBySlug(slug: string): Promise<InsightPost | null> {
  if (isSanityConfigured) {
    const doc = await fetchSanity<SanityPostDoc | null>(postBySlugQuery, { slug });
    if (doc) {
      const mapped = mapSanityPost(doc);
      if (mapped) return mapped;
    }
  }
  const sample = articles.find((a) => a.slug === slug);
  if (!sample) return null;
  return sampleToInsight(sample, articles.findIndex((a) => a.slug === slug));
}

export async function getInsightSlugs(): Promise<string[]> {
  if (isSanityConfigured) {
    const slugs = await fetchSanity<string[]>(postSlugsQuery);
    if (slugs?.length) return slugs.filter(Boolean);
  }
  return articles.map((a) => a.slug);
}
