"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type ComingSoonPanelProps = {
  eyebrow?: string;
  title: string;
  copy: string;
  children?: ReactNode;
};

export function ComingSoonPanel({
  eyebrow = "Coming soon",
  title,
  copy,
  children,
}: ComingSoonPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="coming-soon-panel">
      <motion.div
        className="coming-soon-pulse"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
        transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="print-bars">
          <i />
          <i />
          <i />
          <i />
        </span>
        {eyebrow}
      </motion.div>
      <div className="coming-soon-copy">
        <h2 className="display section-title" style={{ color: "inherit", maxWidth: "16ch" }}>
          {title}
        </h2>
        <p className="lede">{copy}</p>
      </div>
      {children}
    </div>
  );
}
