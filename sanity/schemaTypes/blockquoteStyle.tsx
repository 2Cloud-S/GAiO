"use client";

import type { BlockStyleProps } from "sanity";

/**
 * Sanity Studio's default blockquote style renders:
 *   <blockquote><Text as="p"><TextContainer as div>…</TextContainer></Text></blockquote>
 * which is invalid HTML (div inside p) and triggers React nesting/hydration errors.
 *
 * This replacement keeps the editor chrome without nesting a div under a <p>.
 */
export function BlockquoteStyle(props: BlockStyleProps) {
  return (
    <blockquote
      data-testid="text-style--blockquote"
      style={{
        position: "relative",
        display: "block",
        margin: 0,
        paddingLeft: "0.75rem",
        borderLeft: "3px solid var(--card-border-color)",
      }}
    >
      {/* display:block wrapper mirrors Studio TextContainer (Android PTE editing) */}
      <div style={{ display: "block" }}>{props.children}</div>
    </blockquote>
  );
}
