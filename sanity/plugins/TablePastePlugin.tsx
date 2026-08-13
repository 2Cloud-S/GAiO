"use client";

import { BehaviorPlugin } from "@portabletext/editor/plugins";
import { useMemo } from "react";
import { externalTablePasteBehavior } from "./tablePasteBehavior";

/** Registers TSV/HTML table paste handling for PTE table cells. */
export function TablePastePlugin() {
  const behaviors = useMemo(() => [externalTablePasteBehavior], []);
  return <BehaviorPlugin behaviors={behaviors} />;
}
