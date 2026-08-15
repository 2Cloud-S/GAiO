"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const AURA_PROJECT_URL = "https://auraplusplus.com/projects/gaio";
const BADGE_SRC = "/badges/featured-on-aura.svg";
const BADGE_WIDTH = 265;
const BADGE_HEIGHT = 58;

type AuraFeaturedBadgeProps = {
  className?: string;
  /** Soft panel behind the light SVG for dark sections */
  tone?: "dark" | "light";
};

export function AuraFeaturedBadge({ className, tone = "dark" }: AuraFeaturedBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45, margin: "0px 0px -24px 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn("aura-featured", tone === "light" && "aura-featured-light", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        className="aura-featured-link"
        href={AURA_PROJECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="View this project on Aura++"
      >
        {/* Local SVG mirror — remote hotlink avoided; native img keeps SVG crisp */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="aura-featured-badge"
          src={BADGE_SRC}
          alt="Featured on Aura++"
          width={BADGE_WIDTH}
          height={BADGE_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      </a>
    </motion.div>
  );
}
