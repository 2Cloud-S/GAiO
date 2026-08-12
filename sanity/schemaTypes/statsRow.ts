import { BarChartIcon } from "@sanity/icons/BarChart";
import { defineArrayMember, defineField, defineType } from "sanity";

export const statsRowType = defineType({
  name: "statsRow",
  title: "Stats row",
  type: "object",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "items",
      title: "Stats",
      type: "array",
      validation: (rule) => rule.min(1).max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'e.g. "42%" or "3.2×"',
              validation: (rule) => rule.required().max(24),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "detail",
              title: "Detail",
              type: "string",
              description: "Optional supporting line.",
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0;
      const first =
        Array.isArray(items) && items[0]?.label
          ? String(items[0].label)
          : "Stats";
      return {
        title: first,
        subtitle: `${count} metric${count === 1 ? "" : "s"}`,
      };
    },
  },
});
