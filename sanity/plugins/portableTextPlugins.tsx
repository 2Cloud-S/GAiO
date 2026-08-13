"use client";

import type { PortableTextPluginsProps } from "sanity";
import { TablePastePlugin } from "./TablePastePlugin";

/** Post body PTE: built-in table editing + external TSV/HTML table paste. */
export function postBodyPortableTextPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {props.renderDefault({
        ...props,
        plugins: {
          ...props.plugins,
          table: { enabled: true },
        },
      })}
      <TablePastePlugin />
    </>
  );
}
