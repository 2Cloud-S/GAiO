"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { aiOverviewProof, blogHref } from "@/lib/content";
import { cn } from "@/lib/utils";

type AiOverviewProofProps = {
  variant?: "featured" | "evidence";
  className?: string;
};

export function AiOverviewProof({ variant = "featured", className }: AiOverviewProofProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -40px 0px" });
  const reduceMotion = useReducedMotion();
  const blogLink = blogHref(aiOverviewProof.querySlug);
  const isFeatured = variant === "featured";

  return (
    <motion.article
      ref={ref}
      className={cn("ai-overview-proof", isFeatured ? "ai-overview-proof-featured" : "ai-overview-proof-evidence", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.985 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ai-overview-proof-copy">
        <div className="ai-overview-proof-meta">
          <span className={cn("sample-label", "ai-overview-proof-badge")}>
            {isFeatured ? "Live AI Overview citation" : "Approved evidence"}
          </span>
          <p className="ai-overview-proof-eyebrow">
            <Sparkles size={13} aria-hidden="true" />
            Generative search proof
          </p>
        </div>

        <h3 className={cn(isFeatured ? "ai-overview-proof-title" : "display")}>
          {isFeatured
            ? "GaioEngine cited as a source in Google AI Overview."
            : "Observed citation in Google AI Overview."}
        </h3>

        <p className="ai-overview-proof-lede">
          When someone searched for our research on AI search traffic and citations, Google&apos;s AI Overview
          referenced <strong>{aiOverviewProof.sourceName}</strong> as a source. One observed instance—not a
          promise of permanent visibility.
        </p>

        <div className="ai-overview-proof-query" aria-label="Search query">
          <Search size={14} aria-hidden="true" />
          <span>{aiOverviewProof.queryLabel}</span>
        </div>

        <Link className="ai-overview-proof-link" href={blogLink}>
          Read the cited article
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <figure className="ai-overview-proof-visual">
        <div className="ai-overview-proof-frame" aria-hidden="true" />
        <div className="ai-overview-proof-screen">
          <Image
            src={aiOverviewProof.imageSrc}
            alt={`${aiOverviewProof.engine} result citing ${aiOverviewProof.sourceName} for a query about AI search traffic, citations, and discovery.`}
            width={aiOverviewProof.imageWidth}
            height={aiOverviewProof.imageHeight}
            sizes="(max-width: 800px) 100vw, (max-width: 1200px) 50vw, 28rem"
            className="ai-overview-proof-image"
            priority={isFeatured}
          />
        </div>
        <figcaption className="ai-overview-proof-caption">
          Screenshot from Google Search
          <br />
          AI&nbsp;Overviews vary by query, region, and time.
        </figcaption>
      </figure>
    </motion.article>
  );
}
