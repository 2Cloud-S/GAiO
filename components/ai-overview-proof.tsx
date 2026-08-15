"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  aiOverviewProofs,
  blogHref,
  blogListingHref,
  type AiOverviewProofItem,
} from "@/lib/content";
import { cn } from "@/lib/utils";

type AiOverviewProofProps = {
  proof: AiOverviewProofItem;
  variant?: "featured" | "evidence";
  index?: number;
  className?: string;
};

type AiOverviewProofListProps = {
  variant?: "featured" | "evidence";
  className?: string;
};

function articleHref(slug?: string) {
  return slug ? blogHref(slug) : blogListingHref;
}

function LedeWithSource({ lede, sourceName }: { lede: string; sourceName: string }) {
  const idx = lede.indexOf(sourceName);
  if (idx === -1) return lede;
  return (
    <>
      {lede.slice(0, idx)}
      <strong>{sourceName}</strong>
      {lede.slice(idx + sourceName.length)}
    </>
  );
}

export function AiOverviewProof({
  proof,
  variant = "featured",
  index = 0,
  className,
}: AiOverviewProofProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });
  const reduceMotion = useReducedMotion();
  const blogLink = articleHref(proof.querySlug);
  const isFeatured = variant === "featured";
  const hasArticle = Boolean(proof.querySlug);
  const staggerDelay = reduceMotion ? 0 : index * 0.12;

  return (
    <motion.article
      ref={ref}
      className={cn(
        "ai-overview-proof",
        isFeatured ? "ai-overview-proof-featured" : "ai-overview-proof-evidence",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={
        inView || reduceMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 28, scale: 0.985 }
      }
      transition={{ duration: 0.7, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
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

        <h3 className="ai-overview-proof-title">
          {isFeatured ? proof.featuredTitle : proof.evidenceTitle}
        </h3>

        <p className="ai-overview-proof-lede">
          <LedeWithSource lede={proof.lede} sourceName={proof.sourceName} />
        </p>

        <div className="ai-overview-proof-query" aria-label="Search query">
          <Search size={14} aria-hidden="true" />
          <span>{proof.queryLabel}</span>
        </div>

        <Link className="ai-overview-proof-link" href={blogLink}>
          {hasArticle ? "Read the cited article" : "Browse insights"}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <figure className="ai-overview-proof-visual">
        <div className="ai-overview-proof-frame" aria-hidden="true" />
        <div className="ai-overview-proof-screen">
          <Image
            src={proof.imageSrc}
            alt={`${proof.engine} result citing ${proof.sourceName} for a query about ${proof.imageAltTopic}.`}
            width={proof.imageWidth}
            height={proof.imageHeight}
            sizes="(max-width: 800px) 100vw, (max-width: 1100px) 100vw, (max-width: 1200px) 50vw, 28rem"
            className="ai-overview-proof-image"
            style={{ objectPosition: proof.imageObjectPosition ?? "top center" }}
            priority={isFeatured && index === 0}
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

export function AiOverviewProofList({
  variant = "featured",
  className,
}: AiOverviewProofListProps) {
  return (
    <div className={cn("ai-overview-proof-list", className)}>
      {aiOverviewProofs.map((proof, index) => (
        <AiOverviewProof key={proof.id} proof={proof} variant={variant} index={index} />
      ))}
    </div>
  );
}
