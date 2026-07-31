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
  likes,
  views,
  comments,
  mainImage
`;

export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${postFields}
  }
`);

export const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...3] {
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
