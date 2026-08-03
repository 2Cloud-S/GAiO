import { defineQuery } from "next-sanity";

const postFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  category,
  readTime,
  publishedAt,
  featured,
  likes,
  views,
  "comments": coalesce(
    count(*[_type == "comment" && post._ref == ^._id && approved == true]),
    comments,
    0
  ),
  "mainImage": select(defined(mainImage.asset) => mainImage, null)
`;

/** All published posts for /blog — no artificial cap. */
export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${postFields}
  }
`);

/**
 * Homepage Insights: featured posts first, then newest.
 * Slice is exclusive end — [0...3] returns up to 3 documents.
 */
export const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]
    | order(coalesce(featured, false) desc, publishedAt desc)[0...3] {
    ${postFields}
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
  }
`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`);

export const commentsByPostQuery = defineQuery(`
  *[_type == "comment" && post._ref == $postId && approved == true]
    | order(createdAt desc) {
    _id,
    name,
    body,
    createdAt
  }
`);
