import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { articles, type Article } from "@/lib/content";
import { getClient } from "./client";
import { resolveImageUrl } from "./image";
import {
  commentsByPostQuery,
  latestPostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsQuery,
} from "./queries";
import { isSanityConfigured } from "../env";
import type { PublicComment } from "@/lib/comments";

export type InsightComment = PublicComment;

/** Seconds — keeps /blog and homepage Insights fresh after Studio publishes. */
const SANITY_REVALIDATE_SECONDS = 60;

export type InsightPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt: string | null;
  featured: boolean;
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
  featured?: boolean | null;
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
    featured: index === 0,
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
    featured: Boolean(doc.featured),
    likes: doc.likes ?? 0,
    views: doc.views ?? 0,
    comments: doc.comments ?? 0,
    imageUrl: resolveImageUrl(doc.mainImage, (b) => b.width(800)),
    body: doc.body ?? undefined,
    source: "sanity",
  };
}

async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = ["sanity-post"],
): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: SANITY_REVALIDATE_SECONDS,
        tags,
      },
    });
  } catch (error) {
    console.error(
      "[sanity] fetch failed — falling back to sample insights. Check NEXT_PUBLIC_SANITY_* env and network.",
      error,
    );
    return null;
  }
}

export async function getInsightPosts(): Promise<InsightPost[]> {
  if (isSanityConfigured) {
    const docs = await fetchSanity<SanityPostDoc[]>(postsQuery);
    // null = fetch failed / not configured path; [] = Sanity has no published posts
    if (docs) {
      return docs.map(mapSanityPost).filter((p): p is InsightPost => Boolean(p));
    }
  } else {
    console.warn(
      "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID missing or placeholder — using sample insights",
    );
  }
  return articles.map(sampleToInsight);
}

export async function getLatestInsightPosts(limit = 3): Promise<InsightPost[]> {
  if (isSanityConfigured) {
    const docs = await fetchSanity<SanityPostDoc[]>(latestPostsQuery);
    if (docs) {
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
    if (slugs) return slugs.filter(Boolean);
  }
  return articles.map((a) => a.slug);
}

export async function getCommentsForPost(
  postId: string,
): Promise<InsightComment[]> {
  if (!isSanityConfigured || postId.startsWith("sample-")) return [];
  const comments = await fetchSanity<InsightComment[]>(
    commentsByPostQuery,
    { postId },
    ["sanity-comment", `sanity-comment-${postId}`],
  );
  return comments ?? [];
}
