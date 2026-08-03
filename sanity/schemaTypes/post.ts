import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockquoteStyle } from "./blockquoteStyle";

export const postType = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Signal / Proof",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "readTime",
      title: "Read time",
      type: "string",
      description: 'e.g. "6 min read"',
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      description:
        "When enabled, this post is preferred in the Insights section on the homepage. If fewer than three posts are featured, the newest published posts fill the remaining slots.",
      initialValue: false,
    }),
    defineField({
      name: "likes",
      title: "Likes (display)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "views",
      title: "Views (display)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "comments",
      title: "Comments (display)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Heading 5", value: "h5" },
            { title: "Heading 6", value: "h6" },
            {
              title: "Quote",
              value: "blockquote",
              component: BlockquoteStyle,
            },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "mainImage",
      featured: "featured",
    },
    prepare({ title, author, media, featured }) {
      return {
        title,
        subtitle: featured ? `Featured · ${author || "Untitled author"}` : author,
        media,
      };
    },
  },
});
