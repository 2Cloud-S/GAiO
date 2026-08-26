"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { MethodStageCard } from "@/components/method-stage-card";
import { Highlighter } from "@/components/ui/highlighter";
import { IconCloud } from "@/components/ui/icon-cloud";
import { LineShadowText as MagicLineShadowText } from "@/components/ui/line-shadow-text";
import { MorphingText } from "@/components/ui/morphing-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import MagicText3DFlip from "@/components/ui/text-3d-flip";
import { cn } from "@/lib/utils";

export { Highlighter };

/** Full phrases so MorphingText keeps a coherent line while cycling engines. */
const MORPH_PHRASES = [
  "From SEO to answer inclusion.",
  "From GEO to answer inclusion.",
  "From AEO to answer inclusion.",
];

const ENGINE_LABELS = [
  "Google AI Overviews",
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "Claude",
  "Copilot",
  "Brave Search",
  "You.com",
] as const;

/** Local SVGs — crisp on the dark panel (white/brand fills). Repeated for sphere density. */
const ENGINE_ICON_IMAGES = [
  "/engine-icons/google.svg",
  "/engine-icons/openai-white.svg",
  "/engine-icons/perplexity.svg",
  "/engine-icons/googlegemini.svg",
  "/engine-icons/anthropic-white.svg",
  "/engine-icons/microsoft-copilot.svg",
  "/engine-icons/brave.svg",
  "/engine-icons/youcom.svg",
];

const ENGINE_CLOUD_IMAGES = [
  ...ENGINE_ICON_IMAGES,
  ...ENGINE_ICON_IMAGES,
  ...ENGINE_ICON_IMAGES,
];

/** Magic UI Line Shadow Text — white shadow for the dark hero. */
export function LineShadowText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <MagicLineShadowText
      shadowColor="white"
      className={cn("align-baseline italic", className)}
    >
      {children}
    </MagicLineShadowText>
  );
}

/** Magic UI Morphing Text — cycles SEO / GEO / AEO into the same supporting line. */
export function MorphStatement() {
  const reduceMotion = useReducedMotion();
  const [coolTime, setCoolTime] = useState(3.5);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 800px)");
    const apply = () => setCoolTime(mq.matches ? 6 : 3.5);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (reduceMotion) {
    return (
      <p className="morph-line morph-line-static">{MORPH_PHRASES[0]}</p>
    );
  }

  return (
    <MorphingText
      texts={MORPH_PHRASES}
      morphTime={1.5}
      coolTime={coolTime}
      className={cn(
        "morph-line",
        "mx-0 h-10 max-w-[42rem] justify-start overflow-visible text-left",
        "font-mono text-[length:var(--text-lg)] font-bold leading-10 tracking-normal",
        "whitespace-nowrap md:h-10 lg:text-[length:var(--text-lg)]",
      )}
    />
  );
}

/** Full Search Shift headlines — Text3DFlip remounts each phrase so the whole line flips. */
const SEARCH_SHIFT_PHRASES = [
  "Marketing is evolving from rankings.",
  "Marketing is evolving from answers.",
  "Marketing is evolving from listings.",
  "Marketing is evolving from blue links.",
] as const;

/** Longest phrase reserves layout so shorter lines don't reflow the section. */
const SEARCH_SHIFT_LAYOUT_PHRASE = SEARCH_SHIFT_PHRASES.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest
);

/** Pause after a flip settles before crossfading to the next phrase. */
const SEARCH_SHIFT_DWELL_MS = 2400;
const SEARCH_SHIFT_CROSSFADE_MS = 280;

/** Magic UI Text 3D Flip — full-line phrase cycle synced to flip completion. */
export function Text3DFlip({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(hostRef, { amount: 0.35 });
  const dwellTimerRef = useRef<number | null>(null);
  const leftViewRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const phrase = SEARCH_SHIFT_PHRASES[index] ?? SEARCH_SHIFT_PHRASES[0];

  const clearDwell = useCallback(() => {
    if (dwellTimerRef.current != null) {
      window.clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  const advanceAfterFlip = useCallback(() => {
    clearDwell();
    if (!inView || reduceMotion) return;

    dwellTimerRef.current = window.setTimeout(() => {
      setIndex((current) => (current + 1) % SEARCH_SHIFT_PHRASES.length);
    }, SEARCH_SHIFT_DWELL_MS);
  }, [clearDwell, inView, reduceMotion]);

  useEffect(() => () => clearDwell(), [clearDwell]);

  useEffect(() => {
    if (reduceMotion) return;

    if (!inView) {
      clearDwell();
      leftViewRef.current = true;
      return;
    }

    if (leftViewRef.current) {
      leftViewRef.current = false;
      setPlayKey((key) => key + 1);
    }
  }, [inView, reduceMotion, clearDwell]);

  if (reduceMotion) {
    return (
      <span ref={hostRef} className={className}>
        {SEARCH_SHIFT_PHRASES[0]}
      </span>
    );
  }

  return (
    <span ref={hostRef} className={cn("grid min-w-0", className)}>
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 inline-flex max-w-full flex-wrap"
      >
        {SEARCH_SHIFT_LAYOUT_PHRASE}
      </span>
      <span className="col-start-1 row-start-1 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${phrase}-${playKey}`}
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SEARCH_SHIFT_CROSSFADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagicText3DFlip
              as="span"
              playOnMount
              interactive={false}
              resetAfterFlip={false}
              onAnimationComplete={advanceAfterFlip}
              className="inline-flex max-w-full flex-wrap align-baseline [perspective:800px]"
              textClassName="bg-[var(--color-paper)] text-[var(--color-ink)]"
              flipTextClassName="bg-[var(--color-paper)] text-[var(--color-ink)]"
              rotateDirection="top"
              staggerDuration={0.045}
              staggerFrom="first"
              transition={{ type: "spring", damping: 32, stiffness: 120, mass: 0.85 }}
            >
              {phrase}
            </MagicText3DFlip>
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export function TextReveal({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const words = children.split(" ");

  return (
    <p ref={ref} className="text-reveal" aria-label={children}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          key={`${word}-${index}`}
          initial={false}
          animate={
            inView || reduceMotion
              ? { color: "var(--color-ink)", opacity: 1 }
              : { color: "var(--color-muted)", opacity: 0.42 }
          }
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.045, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}{index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

export function KineticText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const repeated = `${text} · ${text} · ${text} · ${text} · `;
  const shouldAnimate = !reduceMotion && inView;

  return (
    <div ref={ref} className="kinetic-band" aria-hidden="true">
      <motion.div
        className="kinetic-track"
        animate={shouldAnimate ? { x: ["0%", "-25%"] } : { x: 0 }}
        transition={
          shouldAnimate
            ? { duration: 20, ease: "linear", repeat: Infinity }
            : { duration: 0 }
        }
      >
        <span>{repeated}</span>
        <span>{repeated}</span>
      </motion.div>
    </div>
  );
}

export function EngineCloud() {
  const [images, setImages] = useState(() => [...ENGINE_CLOUD_IMAGES]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 800px)");
    const apply = () =>
      setImages(mq.matches ? [...ENGINE_ICON_IMAGES] : [...ENGINE_CLOUD_IMAGES]);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="engine-panel">
      <div
        className="engine-cloud"
        aria-label="Generative search engines we monitor"
      >
        <p className="engine-core-label">
          GEO <small>engine signals</small>
        </p>
        <IconCloud images={images} showControl={false} />
      </div>
      <div className="engine-list" aria-label="Engine names">
        {ENGINE_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="metric-number" aria-label={`${value}${suffix}`}>
      <NumberTicker
        value={value}
        startValue={reduceMotion ? value : 0}
        className="metric-ticker text-current tracking-[-0.07em]"
      />
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

export function PixelProof() {
  return (
    <div className="proof-frame">
      <div className="pixel-grid" aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <i key={index} style={{ "--n": index } as CSSProperties} />
        ))}
      </div>
      <div className="proof-content">
        <span className="sample-label">Illustrative evidence panel</span>
        <blockquote>
          Turn expertise into pages that can be{" "}
          <Highlighter
            action="highlight"
            color="#e1e1e1"
            animationDuration={700}
            iterations={2}
            padding={2}
            multiline
            isView
            className="proof-highlight"
          >
            interpreted, checked, and surfaced
          </Highlighter>
          .
        </blockquote>
      </div>
    </div>
  );
}

export function MethodFlow({ steps }: { steps: { index: string; title: string; detail: string }[] }) {
  return (
    <div className="method-grid">
      {steps.map((step) => (
        <MethodStageCard
          key={step.index}
          id={step.title.toLowerCase()}
          index={step.index}
          title={step.title}
          detail={step.detail}
        />
      ))}
    </div>
  );
}
