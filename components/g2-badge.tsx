"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const G2_REVIEWS_URL = "https://www.g2.com/products/gaio-engine/reviews";
const BADGE_SRC = "/badges/review-on-g2.svg";
const BADGE_WIDTH = 44;
const BADGE_HEIGHT = 44;

type G2BadgeProps = {
  className?: string;
  /** Soft panel behind the light SVG for dark sections */
  tone?: "dark" | "light";
};

export function G2Badge({ className, tone = "dark" }: G2BadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45, margin: "0px 0px -24px 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn("social-proof-badge", tone === "light" && "social-proof-badge-light", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : 0.08 }}
    >
      <a
        className="social-proof-link g2-badge-link"
        href={G2_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Review GAiO Engine on G2"
      >
        {/* Local SVG — compact G2 mark (#FF492C); full review badge requires my.G2 login */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="social-proof-img g2-badge-img"
          src={BADGE_SRC}
          alt="View GAiO Engine reviews on G2"
          width={BADGE_WIDTH}
          height={BADGE_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      </a>
    </motion.div>
  );
}
