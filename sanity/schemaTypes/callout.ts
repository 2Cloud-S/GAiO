import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";

const tones = [
  { title: "Note", value: "note" },
  { title: "Tip", value: "tip" },
  { title: "Warning", value: "warning" },
  { title: "Important", value: "important" },
] as const;

export const calloutType = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: [...tones], layout: "radio" },
      initialValue: "note",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional short heading (defaults to the tone label).",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", tone: "tone", body: "body" },
    prepare({ title, tone, body }) {
      const toneLabel =
        tones.find((t) => t.value === tone)?.title ?? "Callout";
      return {
        title: title || toneLabel,
        subtitle: typeof body === "string" ? body.slice(0, 80) : toneLabel,
      };
    },
  },
});
