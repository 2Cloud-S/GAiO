import { CodeIcon } from "@sanity/icons/Code";
import { ImageIcon } from "@sanity/icons/Image";
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
      title: "Likes",
      type: "number",
      description: "Persisted via the site like button (and editable here).",
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      description: "Persisted via the site (once per browser session).",
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "comments",
      title: "Comments (legacy display)",
      type: "number",
      description:
        "Optional fallback count. Live pages prefer counting approved comment documents.",
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
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
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              { title: "Code", value: "code" },
              { title: "Highlight", value: "highlight" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                  defineField({
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  }),
                ],
              },
              {
                name: "citation",
                type: "object",
                title: "Citation",
                fields: [
                  defineField({
                    name: "source",
                    type: "string",
                    title: "Source",
                    description: "Publication, author, or short attribution.",
                    validation: (rule) => rule.required().max(200),
                  }),
                  defineField({
                    name: "url",
                    type: "url",
                    title: "Source URL",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        }),
        defineArrayMember({
          type: "table",
          title: "Table",
        }),
        defineArrayMember({
          type: "callout",
          title: "Callout",
        }),
        defineArrayMember({
          type: "code",
          title: "Code block",
          icon: CodeIcon,
        }),
        defineArrayMember({
          type: "horizontalRule",
          title: "Divider",
        }),
        defineArrayMember({
          type: "statsRow",
          title: "Stats row",
        }),
      ],
      components: {
        portableText: {
          plugins: (props) =>
            props.renderDefault({
              ...props,
              plugins: {
                ...props.plugins,
                table: { enabled: true },
              },
            }),
        },
      },
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
