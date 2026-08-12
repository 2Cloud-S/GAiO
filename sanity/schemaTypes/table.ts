import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Canonical table shape for Sanity Studio's built-in PTE table editor
 * (enabled via form.components.portableText.plugins.table — Studio ≥ 6.6).
 * Cells hold Portable Text so editors can bold, link, etc. inside cells.
 */
export const tableType = defineType({
  name: "table",
  title: "Table",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "headerRows",
      title: "Header rows",
      type: "number",
      description: "Number of leading rows treated as headers (usually 1).",
      initialValue: 1,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional accessible table caption shown below the table.",
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "cell",
                  fields: [
                    defineField({
                      name: "value",
                      title: "Content",
                      type: "array",
                      of: [defineArrayMember({ type: "block" })],
                    }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              const count = Array.isArray(cells) ? cells.length : 0;
              return {
                title: `Row · ${count} cell${count === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { rows: "rows", caption: "caption" },
    prepare({ rows, caption }) {
      const rowCount = Array.isArray(rows) ? rows.length : 0;
      return {
        title: caption || "Table",
        subtitle: `${rowCount} row${rowCount === 1 ? "" : "s"}`,
      };
    },
  },
});
