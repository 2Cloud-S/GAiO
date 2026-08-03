import { LayoutFrame, PageHero } from "@/components/page-elements";
import { BlogPostCard } from "@/components/blog-post-card";
import { blogHref } from "@/lib/content";
import { getInsightPosts } from "@/sanity/lib/posts";

export const metadata = { title: "Blog" };

/** Refresh listing after Studio publishes (also set on Sanity fetches). */
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getInsightPosts();

  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Blog"
        title="Thinking clearly about answer-led search."
        copy="Editorial pieces on GEO, citation-ready content, and measuring presence in generative search."
        action={false}
      />
      <section className="section">
        <div className="wrap">
          <div className="blog-card-grid">
            {posts.map((post) => (
              <BlogPostCard
                key={post._id}
                title={post.title}
                subtitle={post.author || post.category}
                href={blogHref(post.slug)}
                image={post.imageUrl}
                likes={post.likes}
                comments={post.comments}
                views={post.views}
              />
            ))}
          </div>
        </div>
      </section>
    </LayoutFrame>
  );
}
