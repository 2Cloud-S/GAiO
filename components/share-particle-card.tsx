"use client";

import Link from "next/link";
import styled from "styled-components";
import { type CSSProperties, useEffect, useRef, useState } from "react";

/** Card stage size — positions are relative to this box. */
const STAGE_W = 200;
const STAGE_H = 300;
const INSET = 14;
const DOT = 5;
const PITCH = 7;

type Cell = { x: number; y: number; size?: number };

/** 5×7 bitmaps for G, A, i, O — 1 = particle. */
const GLYPHS: Record<string, string[]> = {
  G: [
    "01110",
    "10001",
    "10000",
    "10111",
    "10001",
    "10001",
    "01110",
  ],
  A: [
    "00100",
    "01010",
    "10001",
    "10001",
    "11111",
    "10001",
    "10001",
  ],
  i: [
    "010",
    "000",
    "010",
    "010",
    "010",
    "010",
    "010",
  ],
  O: [
    "01110",
    "10001",
    "10001",
    "10001",
    "10001",
    "10001",
    "01110",
  ],
};

const LETTER_ORDER = ["G", "A", "i", "O"] as const;
const LETTER_GAP = 8;

function glyphWidth(rows: string[]) {
  return Math.max(...rows.map((r) => r.length));
}

function buildLetterform(): Cell[] {
  const widths = LETTER_ORDER.map((k) => glyphWidth(GLYPHS[k]));
  const totalW =
    widths.reduce((a, w) => a + (w - 1) * PITCH + DOT, 0) +
    LETTER_GAP * (LETTER_ORDER.length - 1);
  const totalH = (7 - 1) * PITCH + DOT;

  let originX = Math.round((STAGE_W - totalW) / 2);
  const originY = Math.round(STAGE_H * 0.34 - totalH / 2);

  const cells: Cell[] = [];

  LETTER_ORDER.forEach((key, li) => {
    const rows = GLYPHS[key];
    const w = widths[li];
    rows.forEach((row, ry) => {
      for (let rx = 0; rx < w; rx++) {
        if (row[rx] !== "1") continue;
        const isAccent =
          (key === "A" && ry === 4) ||
          (key === "i" && ry === 0) ||
          (key === "G" && ry === 3 && rx >= 2);
        cells.push({
          x: originX + rx * PITCH,
          y: originY + ry * PITCH,
          size: isAccent ? 6 : DOT,
        });
      }
    });
    originX += (w - 1) * PITCH + DOT + LETTER_GAP;
  });

  return cells;
}

/** Deterministic 0–1 for SSR-safe rest scatter. */
function hash01(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function restPosition(i: number, size: number) {
  const maxX = STAGE_W - INSET - size;
  const maxY = STAGE_H - INSET - size - 36; // leave room for label
  return {
    x: Math.round(INSET + hash01(i * 2.1) * (maxX - INSET)),
    y: Math.round(INSET + hash01(i * 3.7 + 1) * (maxY - INSET)),
  };
}

const LETTERFORM = buildLetterform();

const DOTS = LETTERFORM.map((cell, i) => {
  const rest = restPosition(i, cell.size ?? DOT);
  return {
    id: i,
    size: cell.size ?? DOT,
    restX: rest.x,
    restY: rest.y,
    hoverX: cell.x,
    hoverY: cell.y,
  };
});

export function ShareParticleCard() {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [converged, setConverged] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Near bottom of viewport: treat as “hovered” so mobile gets the letterform.
        setConverged(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.55, 0.75], rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <StyledWrapper>
      <Link
        ref={cardRef}
        className={converged ? "card is-converged" : "card"}
        href="/assessment"
        aria-label="Share the assessment — open readiness assessment"
      >
        <div className="stage" aria-hidden="true">
          {DOTS.map((dot) => (
            <span
              key={dot.id}
              className="dot"
              style={
                {
                  width: dot.size,
                  height: dot.size,
                  "--rest-x": `${dot.restX}px`,
                  "--rest-y": `${dot.restY}px`,
                  "--hover-x": `${dot.hoverX}px`,
                  "--hover-y": `${dot.hoverY}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="label" aria-hidden="true">
          GAiO
        </div>
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: block;
  width: fit-content;
  max-width: 100%;
  align-self: start;
  justify-self: start;
  /* Clip scale growth so the footer stays clean */
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 2px;

  a.card {
    text-decoration: none;
    color: inherit;
    display: block;
    max-width: 100%;
  }

  .card {
    width: ${STAGE_W}px;
    max-width: 100%;
    height: ${STAGE_H}px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background:
      linear-gradient(
        160deg,
        color-mix(in srgb, var(--color-graphite) 55%, transparent) 0%,
        transparent 42%
      ),
      radial-gradient(
        120% 80% at 20% 0%,
        color-mix(in srgb, var(--color-paper) 6%, transparent),
        transparent 55%
      ),
      var(--color-ink-soft);
    border: 1px solid var(--color-graphite);
    border-radius: var(--radius-lg);
    transition:
      scale var(--dur-base) var(--ease-out),
      border-color var(--dur-base) var(--ease-out),
      background-color var(--dur-base) var(--ease-out);
    scale: 1;
  }

  .stage {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .dot {
    position: absolute;
    left: var(--rest-x);
    top: var(--rest-y);
    border-radius: 2px;
    aspect-ratio: 1;
    background: linear-gradient(
      145deg,
      var(--color-paper) 0%,
      color-mix(in srgb, var(--color-paper) 38%, transparent) 100%
    );
    border-top: 1px solid color-mix(in srgb, var(--color-paper) 85%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--color-paper) 55%, transparent);
    box-shadow: 0 0 0 0 transparent;
    transition:
      left var(--dur-slow) var(--ease-in-out),
      top var(--dur-slow) var(--ease-in-out),
      background var(--dur-base) var(--ease-out),
      box-shadow var(--dur-base) var(--ease-out);
    will-change: left, top;
  }

  .label {
    position: absolute;
    bottom: var(--space-5);
    left: 50%;
    translate: -50% 0;
    font-family: var(--font-display);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: none;
    color: var(--color-paper);
    opacity: 0;
    transition: opacity var(--dur-slow) var(--ease-out);
    z-index: 1;
  }

  .card.is-converged,
  .card:hover,
  .card:focus-visible {
    scale: 1.03;
    border-color: color-mix(in srgb, var(--color-paper) 28%, var(--color-graphite));
  }

  .card.is-converged .label,
  .card:hover .label,
  .card:focus-visible .label {
    opacity: 1;
  }

  .card.is-converged .dot,
  .card:hover .dot,
  .card:focus-visible .dot {
    left: var(--hover-x);
    top: var(--hover-y);
    background: linear-gradient(
      145deg,
      var(--color-paper) 0%,
      color-mix(in srgb, var(--color-signal) 70%, var(--color-paper)) 100%
    );
  }

  .card:focus-visible {
    outline: 2px solid var(--color-paper);
    outline-offset: 2px;
  }
`;
