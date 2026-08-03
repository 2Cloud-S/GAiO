import { defineField, defineType } from "sanity";

export const commentType = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(1).max(80),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Optional — not shown publicly.",
      validation: (rule) =>
        rule.email().warning("Use a valid email if provided."),
    }),
    defineField({
      name: "body",
      title: "Comment",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(2).max(2000),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      description:
        "Only approved comments appear on the site. Uncheck to hide without deleting.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Newest",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      body: "body",
      approved: "approved",
      postTitle: "post.title",
    },
    prepare({ title, body, approved, postTitle }) {
      const snippet =
        typeof body === "string"
          ? body.length > 60
            ? `${body.slice(0, 60)}…`
            : body
          : "";
      return {
        title: title || "Anonymous",
        subtitle: `${approved ? "Approved" : "Hidden"} · ${postTitle || "Post"}${
          snippet ? ` · ${snippet}` : ""
        }`,
      };
    },
  },
});
