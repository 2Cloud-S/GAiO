import { RemoveIcon } from "@sanity/icons/Remove";
import { defineField, defineType } from "sanity";

export const horizontalRuleType = defineType({
  name: "horizontalRule",
  title: "Divider",
  type: "object",
  icon: RemoveIcon,
  fields: [
    // Sanity requires at least one field on object types used as PTE blocks.
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      hidden: true,
      initialValue: "default",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Divider" };
    },
  },
});
