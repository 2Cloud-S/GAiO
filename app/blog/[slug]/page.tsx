import { notFound } from "next/navigation";
import { LayoutFrame } from "@/components/page-elements";
import { PostBody } from "@/components/post-body";
import { PostReaction } from "@/components/post-reaction";
import { getInsightBySlug, getInsightSlugs } from "@/sanity/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  return {
    title: post ? post.title : "Post not found",
    description: post?.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) notFound();

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : post.source === "sample"
      ? "Sample insight"
      : null;

  return (
    <LayoutFrame>
      <article>
        <header className="page-hero">
          <div className="wrap section-intro">
            <p className="eyebrow">
              {post.category}
              {post.readTime ? ` · ${post.readTime}` : ""}
              {dateLabel ? ` · ${dateLabel}` : ""}
            </p>
            <h1 className="display headline">{post.title}</h1>
            <p className="lede">{post.excerpt}</p>
            <p className="meta" style={{ marginTop: "var(--space-4)" }}>
              {post.author}
            </p>
          </div>
        </header>
        <div className="section">
          <div className="wrap detail-layout">
            <div className="prose">
              <PostBody value={post.body} />
            </div>
            <aside className="reading-rail">
              <span className="meta">Your reaction</span>
              <div style={{ marginTop: "var(--space-4)" }}>
                <PostReaction initialLikes={post.likes} initialDislikes={0} />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </LayoutFrame>
  );
}
