/**
 * GEO AI chat demo (Search Shift) — Zola-inspired window with cursor-driven script.
 * No live API / auth. See `geo-ai-chat-demo.README.md`.
 */
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import {
  ArrowUp,
  Check,
  ChevronDown,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
} from "lucide-react";
import styles from "./geo-ai-chat-demo.module.css";

type ResultStyle =
  | "structured"
  | "conversational"
  | "research"
  | "bullets"
  | "actions";

type Scene = {
  id: string;
  name: string;
  modelLabel: string;
  accent: string;
  prompt: string;
  resultStyle: ResultStyle;
  lead: string;
  blocks: string[];
  cites?: { n: number; title: string; meta: string }[];
  attributes?: string[];
  sources?: string[];
  actions?: string[];
  metrics?: { label: string; value: string }[];
};

type HistoryItem = {
  id: string;
  sceneId: string;
  title: string;
  model: string;
};

type Phase =
  | "to-pill"
  | "open-picker"
  | "to-option"
  | "select"
  | "to-input"
  | "typing"
  | "to-send"
  | "send"
  | "thinking"
  | "answer"
  | "hold";

const SCENES: Scene[] = [
  {
    id: "claude",
    name: "Claude",
    modelLabel: "Claude 4 Sonnet",
    accent: "#1a6b7a",
    prompt: "Best B2B analytics companies for mid-market teams",
    resultStyle: "structured",
    lead: "Category leaders that show up in generative answers tend to be direct, corroborated, and structurally clear.",
    blocks: [
      "1. Acme Analytics — clearest entity definition and methodology pages.",
      "2. Northwind Insights — strong third-party corroboration across reviews.",
      "3. BlueLink Measure — schema-ready product and comparison pages.",
    ],
    attributes: ["Direct", "Corroborated", "Structurally Clear", "Ready to be Evaluated"],
    cites: [
      { n: 1, title: "Category methodology", meta: "Primary source" },
      { n: 2, title: "Vendor evidence pack", meta: "Corroboration" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    modelLabel: "GPT-5",
    accent: "#0f766e",
    prompt: "How do brands get included in AI answers for GEO visibility?",
    resultStyle: "conversational",
    lead: "Inclusion is less about ranking tricks and more about whether models can trust and reuse your claims.",
    blocks: [
      "Make the claim explicit in plain language, then support it with citeable evidence.",
      "Keep pages parseable: stable headings, definitions, and comparison tables beat vague marketing copy.",
      "When multiple sources agree, answer engines are more willing to name your brand in the synthesis.",
    ],
    sources: ["GEO operating notes", "Answer-inclusion checklist", "Evidence patterns"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    modelLabel: "Sonar Pro",
    accent: "#0e7490",
    prompt: "What evidence patterns increase citation likelihood in AI search?",
    resultStyle: "research",
    lead: "Research-style answers prefer sources that are specific, dated, and independently checkable.",
    blocks: [
      "Primary research and methodology pages outperform generic blog posts.",
      "Named entities with consistent identifiers reduce ambiguity across crawls.",
      "Cross-links between claim → proof → example help models reconstruct reasoning.",
    ],
    cites: [
      { n: 1, title: "Citation likelihood study", meta: "2025 · Research" },
      { n: 2, title: "Source quality rubric", meta: "Framework" },
      { n: 3, title: "Entity consistency guide", meta: "Practice note" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    modelLabel: "Gemini 2.5 Pro",
    accent: "#1d4ed8",
    prompt: "Map the entity graph for a GEO-ready professional services firm",
    resultStyle: "bullets",
    lead: "A usable knowledge graph for answer engines usually includes these linked nodes:",
    blocks: [
      "Organization — legal name, category, service footprint",
      "Expertise topics — priority questions and claim inventory",
      "People & credentials — attributable specialists",
      "Evidence objects — case notes, methods, third-party mentions",
      "Products / offers — scoped, comparable definitions",
    ],
    metrics: [
      { label: "Entities", value: "48" },
      { label: "Relations", value: "112" },
      { label: "Gaps", value: "7" },
    ],
  },
  {
    id: "copilot",
    name: "Copilot",
    modelLabel: "Copilot",
    accent: "#0369a1",
    prompt: "Draft a workplace brief: why our product belongs in AI answers",
    resultStyle: "actions",
    lead: "Keep the brief short: one claim, proof, and next action for each surface.",
    blocks: [
      "Claim: We are the clearest mid-market option for X.",
      "Proof: Methodology page + two independent corroborations.",
      "Risk: Ambiguous category language still blocks inclusion.",
    ],
    actions: ["Open evidence pack", "Assign owners", "Schedule GEO review"],
  },
];

const PHASE_MS: Record<Exclude<Phase, "typing">, number> = {
  "to-pill": 720,
  "open-picker": 520,
  "to-option": 680,
  select: 420,
  "to-input": 580,
  "to-send": 460,
  send: 360,
  thinking: 1100,
  answer: 2800,
  hold: 1400,
};

const TYPE_MS_PER_CHAR = 26;
const EASE = "outExpo";
const CURSOR_EASE = "outExpo";

type AnimHandle = { pause: () => void; play?: () => void; cancel?: () => void };

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prefersCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function truncateTitle(text: string, max = 42) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function MacCursor() {
  return (
    <svg
      className={styles.cursorSvg}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5.5 3.2 18.8 12.1l-6.2 1.5 3.4 6.9-2.6 1.3-3.5-7.1-4.4 4.1V3.2Z"
        fill="#111"
        stroke="#fff"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnswerBody({ scene }: { scene: Scene }) {
  return (
    <div className={styles.answerBody} data-answer>
      <p className={styles.answerLead} data-reveal>
        {scene.lead}
      </p>
      <ul className={styles.answerList}>
        {scene.blocks.map((block) => (
          <li key={block} data-reveal>
            {block}
          </li>
        ))}
      </ul>
      {scene.attributes ? (
        <div className={styles.attrRow} data-reveal-group>
          {scene.attributes.map((attr) => (
            <span key={attr} className={styles.attrChip} data-reveal>
              {attr}
            </span>
          ))}
        </div>
      ) : null}
      {scene.sources ? (
        <div className={styles.sourceRow} data-reveal-group>
          {scene.sources.map((source) => (
            <span key={source} className={styles.sourceChip} data-reveal>
              {source}
            </span>
          ))}
        </div>
      ) : null}
      {scene.cites ? (
        <div className={styles.citeGrid} data-reveal-group>
          {scene.cites.map((cite) => (
            <article key={cite.n} className={styles.citeCard} data-reveal>
              <span className={styles.citeNum}>{cite.n}</span>
              <div>
                <strong>{cite.title}</strong>
                <small>{cite.meta}</small>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {scene.metrics ? (
        <div className={styles.metricRow} data-reveal-group>
          {scene.metrics.map((metric) => (
            <div key={metric.label} className={styles.metric} data-reveal>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      {scene.actions ? (
        <div className={styles.actionRow} data-reveal-group>
          {scene.actions.map((action) => (
            <span key={action} className={styles.actionChip} data-reveal>
              {action}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function cursorPointInShell(shell: HTMLElement, el: HTMLElement) {
  const shellBox = shell.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  return {
    x: box.left - shellBox.left + box.width * 0.52,
    y: box.top - shellBox.top + box.height * 0.55,
  };
}

function isAbortError(err: unknown) {
  return err instanceof DOMException
    ? err.name === "AbortError"
    : err instanceof Error && err.name === "AbortError";
}

/** Double-rAF after paint; cancelled flag closes the classic cancelAnimationFrame race. */
function afterLayout(cb: () => void) {
  let outer = 0;
  let inner = 0;
  let cancelled = false;
  outer = window.requestAnimationFrame(() => {
    if (cancelled) return;
    inner = window.requestAnimationFrame(() => {
      if (cancelled) return;
      cb();
    });
  });
  return () => {
    cancelled = true;
    window.cancelAnimationFrame(outer);
    window.cancelAnimationFrame(inner);
  };
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Resolves after two animation frames, or when `timeoutMs` elapses — whichever first. */
function waitForLayout(signal: AbortSignal, timeoutMs = 600) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      cancel();
      signal.removeEventListener("abort", onAbort);
      window.clearTimeout(timer);
      resolve();
    };
    const onAbort = () => {
      if (settled) return;
      settled = true;
      cancel();
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const cancel = afterLayout(finish);
    const timer = window.setTimeout(finish, timeoutMs);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function waitForElement(
  getEl: () => HTMLElement | null | undefined,
  signal: AbortSignal,
  timeoutMs = 1200,
) {
  const start = performance.now();
  while (!signal.aborted) {
    const el = getEl();
    if (el && el.getClientRects().length > 0) return el;
    if (performance.now() - start >= timeoutMs) return getEl() ?? null;
    await sleep(32, signal);
  }
  throw new DOMException("Aborted", "AbortError");
}

export function GeoAiChatDemo() {
  const labelId = useId();
  const listId = useId();
  const historyId = useId();

  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<AnimHandle | null>(null);
  const cursorAnimRef = useRef<AnimHandle | null>(null);
  const cursorTargetRef = useRef<HTMLElement | null>(null);
  const clickTimer = useRef<number | null>(null);
  const runAbortRef = useRef<AbortController | null>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(false);
  const manualModeRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("to-pill");
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [cursorClick, setCursorClick] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [manualMode, setManualMode] = useState(false);

  const scene = SCENES[index] ?? SCENES[0];
  const cursorDemo = !reducedMotion && !coarsePointer;
  const showCursor = cursorDemo && !manualMode && cursorVisible;
  const showUser =
    phase === "thinking" || phase === "answer" || phase === "hold" || phase === "send";
  const showTyping = phase === "thinking";
  const showAnswer = phase === "answer" || phase === "hold";
  const composerText =
    phase === "typing" || phase === "to-send" || phase === "send"
      ? draft
      : showUser
        ? scene.prompt
        : "";

  pausedRef.current = paused;
  inViewRef.current = inView;
  manualModeRef.current = manualMode;

  const clearTimers = useCallback(() => {
    if (clickTimer.current != null) window.clearTimeout(clickTimer.current);
    clickTimer.current = null;
  }, []);

  const abortRun = useCallback(() => {
    runAbortRef.current?.abort();
    runAbortRef.current = null;
    clearTimers();
  }, [clearTimers]);

  const stopCursorAnim = useCallback(() => {
    cursorAnimRef.current?.pause();
    cursorAnimRef.current?.cancel?.();
    cursorAnimRef.current = null;
  }, []);

  const moveCursorTo = useCallback(
    (el: HTMLElement | null, duration = 520) => {
      const shell = shellRef.current;
      const cursor = cursorRef.current;
      if (!shell || !cursor || !el) return;

      cursorTargetRef.current = el;
      const { x, y } = cursorPointInShell(shell, el);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      setCursorVisible(true);
      stopCursorAnim();

      try {
        const anim = animate(cursor, {
          left: `${x}px`,
          top: `${y}px`,
          duration,
          ease: CURSOR_EASE,
        });
        cursorAnimRef.current = anim as AnimHandle;
      } catch {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursorAnimRef.current = null;
      }
    },
    [stopCursorAnim],
  );

  const remountCursorToTarget = useCallback(
    (duration = 280) => {
      const target = cursorTargetRef.current;
      if (!target || !cursorVisible || pausedRef.current || manualModeRef.current) return;
      moveCursorTo(target, duration);
    },
    [cursorVisible, moveCursorTo],
  );

  const pulseClick = useCallback(() => {
    setCursorClick(true);
    if (clickTimer.current != null) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => setCursorClick(false), 160);
  }, []);

  /** Pause-aware delay: hover/offscreen freezes the clock; resume continues the same step. */
  const delay = useCallback(async (ms: number, signal: AbortSignal) => {
    let remaining = ms;
    while (remaining > 0) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      while (
        pausedRef.current ||
        !inViewRef.current ||
        manualModeRef.current
      ) {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        cursorAnimRef.current?.pause();
        await sleep(48, signal);
      }
      cursorAnimRef.current?.play?.();
      const slice = Math.min(64, remaining);
      const started = performance.now();
      await sleep(slice, signal);
      if (
        pausedRef.current ||
        !inViewRef.current ||
        manualModeRef.current
      ) {
        continue;
      }
      remaining -= performance.now() - started;
    }
  }, []);

  const pushHistory = useCallback((s: Scene) => {
    setHistory((prev) => {
      const existing = prev.findIndex((item) => item.sceneId === s.id);
      const nextItem: HistoryItem = {
        id: existing >= 0 ? prev[existing]!.id : `${s.id}-${Date.now()}`,
        sceneId: s.id,
        title: truncateTitle(s.prompt),
        model: s.name,
      };
      if (existing >= 0) {
        const copy = [...prev];
        copy.splice(existing, 1);
        return [nextItem, ...copy];
      }
      return [nextItem, ...prev].slice(0, 8);
    });
  }, []);

  const goToScene = useCallback(
    (next: number, opts?: { manual?: boolean }) => {
      abortRun();
      const i = (next + SCENES.length) % SCENES.length;
      setIndex(i);
      setPickerOpen(false);
      setDraft("");
      if (opts?.manual) {
        manualModeRef.current = true;
        setManualMode(true);
        setCursorVisible(false);
        setPhase("answer");
        pushHistory(SCENES[i]!);
      } else {
        manualModeRef.current = false;
        setManualMode(false);
        setPhase(cursorDemo ? "to-pill" : "thinking");
      }
    },
    [abortRun, cursorDemo, pushHistory],
  );

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setCoarsePointer(prefersCoarsePointer());
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqPointer = window.matchMedia("(pointer: coarse)");
    const mqNarrow = window.matchMedia("(max-width: 760px)");
    const onMotion = () => setReducedMotion(mqMotion.matches);
    const onPointer = () => setCoarsePointer(mqPointer.matches);
    const onNarrow = () => {
      setIsNarrow(mqNarrow.matches);
      setHistoryOpen(!mqNarrow.matches);
    };
    onNarrow();
    mqMotion.addEventListener("change", onMotion);
    mqPointer.addEventListener("change", onPointer);
    mqNarrow.addEventListener("change", onNarrow);
    return () => {
      mqMotion.removeEventListener("change", onMotion);
      mqPointer.removeEventListener("change", onPointer);
      mqNarrow.removeEventListener("change", onNarrow);
    };
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        inViewRef.current = visible;
        setInView(visible);
      },
      { threshold: 0.08, rootMargin: "100px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Recalculate cursor after history / picker layout settles
  useEffect(() => {
    if (!cursorDemo || !cursorVisible || paused || manualMode) return;
    const cancel = afterLayout(() => remountCursorToTarget(320));
    return cancel;
  }, [
    cursorDemo,
    cursorVisible,
    historyOpen,
    manualMode,
    paused,
    pickerOpen,
    remountCursorToTarget,
  ]);

  // Resume anime.js cursor when hover/focus pause ends
  useEffect(() => {
    if (paused || manualMode || !inView) {
      cursorAnimRef.current?.pause();
      return;
    }
    cursorAnimRef.current?.play?.();
  }, [paused, manualMode, inView]);

  // Cursor + phase orchestration (abortable, pause-aware — never hangs on layout waits)
  useEffect(() => {
    abortRun();

    if (manualMode) return;

    const ac = new AbortController();
    runAbortRef.current = ac;
    const { signal } = ac;

    const run = async () => {
      try {
        // Wait until the demo is allowed to run (in view, not hovered)
        while (pausedRef.current || !inViewRef.current) {
          if (signal.aborted) return;
          cursorAnimRef.current?.pause();
          await sleep(48, signal);
        }
        cursorAnimRef.current?.play?.();

        if (!cursorDemo) {
          setPickerOpen(false);
          setCursorVisible(false);
          if (
            phase === "to-pill" ||
            phase === "open-picker" ||
            phase === "to-option" ||
            phase === "select" ||
            phase === "to-input" ||
            phase === "typing" ||
            phase === "to-send" ||
            phase === "send"
          ) {
            setDraft(scene.prompt);
            setPhase("thinking");
            return;
          }
          if (phase === "thinking") {
            await delay(PHASE_MS.thinking, signal);
            pushHistory(scene);
            setPhase("answer");
          } else if (phase === "answer") {
            await delay(PHASE_MS.answer, signal);
            setPhase("hold");
          } else if (phase === "hold") {
            await delay(PHASE_MS.hold, signal);
            setIndex((c) => (c + 1) % SCENES.length);
            setPhase("thinking");
            setDraft("");
          }
          return;
        }

        switch (phase) {
          case "to-pill": {
            setPickerOpen(false);
            setDraft("");
            moveCursorTo(pillRef.current, 640);
            await delay(PHASE_MS["to-pill"], signal);
            setPhase("open-picker");
            break;
          }
          case "open-picker": {
            pulseClick();
            setPickerOpen(true);
            await delay(PHASE_MS["open-picker"], signal);
            setPhase("to-option");
            break;
          }
          case "to-option": {
            await waitForLayout(signal, 700);
            const item = await waitForElement(
              () =>
                menuRef.current?.querySelector<HTMLElement>(
                  `[data-model-id="${scene.id}"]`,
                ),
              signal,
              1200,
            );
            if (item) {
              void item.offsetWidth;
              moveCursorTo(item, 580);
            }
            await delay(PHASE_MS["to-option"], signal);
            setPhase("select");
            break;
          }
          case "select": {
            pulseClick();
            setPickerOpen(false);
            await delay(PHASE_MS.select, signal);
            setPhase("to-input");
            break;
          }
          case "to-input": {
            moveCursorTo(inputAreaRef.current, 560);
            await delay(PHASE_MS["to-input"], signal);
            setPhase("typing");
            break;
          }
          case "typing": {
            setDraft("");
            const full = scene.prompt;
            for (let i = 1; i <= full.length; i += 1) {
              if (signal.aborted) return;
              await delay(TYPE_MS_PER_CHAR, signal);
              setDraft(full.slice(0, i));
            }
            setPhase("to-send");
            break;
          }
          case "to-send": {
            moveCursorTo(sendRef.current, 480);
            await delay(PHASE_MS["to-send"], signal);
            setPhase("send");
            break;
          }
          case "send": {
            pulseClick();
            await delay(PHASE_MS.send, signal);
            setPhase("thinking");
            break;
          }
          case "thinking": {
            await delay(PHASE_MS.thinking, signal);
            setPhase("answer");
            break;
          }
          case "answer": {
            pushHistory(scene);
            await delay(PHASE_MS.answer, signal);
            setPhase("hold");
            break;
          }
          case "hold": {
            await delay(PHASE_MS.hold, signal);
            setIndex((c) => (c + 1) % SCENES.length);
            setPhase("to-pill");
            setDraft("");
            break;
          }
        }
      } catch (err) {
        if (!isAbortError(err)) {
          // Soft-recover: advance so a single failure can't freeze the loop
          window.setTimeout(() => {
            if (manualModeRef.current || runAbortRef.current !== ac) return;
            setPhase((p) => {
              if (p === "hold") return "to-pill";
              if (p === "answer") return "hold";
              if (p === "thinking" || p === "send") return "answer";
              if (p === "typing" || p === "to-send") return "to-send";
              return "to-pill";
            });
          }, 400);
        }
      }
    };

    void run();

    return () => {
      if (runAbortRef.current === ac) runAbortRef.current = null;
      ac.abort();
      clearTimers();
    };
  }, [
    abortRun,
    clearTimers,
    cursorDemo,
    delay,
    // inView/paused intentionally omitted: delay() polls refs so pause/resume
    // does not abort mid-step (which previously dropped later() forever).
    manualMode,
    moveCursorTo,
    phase,
    pulseClick,
    pushHistory,
    scene,
  ]);

  // Answer reveals only (menu open uses CSS — avoid fighting transforms)
  useEffect(() => {
    const root = chatRef.current;
    if (!root || !inView) return;

    timelineRef.current?.pause();
    timelineRef.current?.cancel?.();
    timelineRef.current = null;

    if (reducedMotion) {
      utils.set(root.querySelectorAll("[data-reveal], [data-user], [data-typing]"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const tl = createTimeline({
      defaults: { ease: EASE, duration: 520 },
      autoplay: true,
    });
    timelineRef.current = tl as AnimHandle;

    if (showUser && (phase === "send" || phase === "thinking")) {
      const user = root.querySelector<HTMLElement>("[data-user]");
      if (user) {
        utils.set(user, { opacity: 0, y: 10 });
        tl.add(user, { opacity: 1, y: 0, duration: 420 }, 0);
      }
    }

    if (showTyping) {
      const typing = root.querySelector<HTMLElement>("[data-typing]");
      if (typing) {
        utils.set(typing, { opacity: 0, y: 6 });
        tl.add(typing, { opacity: 1, y: 0, duration: 320 }, 0);
      }
    }

    if (showAnswer) {
      const nodes = root.querySelectorAll<HTMLElement>("[data-reveal]");
      utils.set(nodes, { opacity: 0, y: 8 });
      tl.add(nodes, { opacity: 1, y: 0, delay: stagger(68), duration: 500 }, 30);
    }

    return () => {
      timelineRef.current?.pause();
      timelineRef.current?.cancel?.();
      timelineRef.current = null;
    };
  }, [inView, phase, reducedMotion, showAnswer, showTyping, showUser, index]);

  useEffect(() => {
    if (!showAnswer && !showTyping) return;
    const pane = messagesRef.current;
    pane?.scrollTo({ top: pane.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [showAnswer, showTyping, reducedMotion, index]);

  const onSelectModel = (itemIndex: number) => {
    goToScene(itemIndex, { manual: true });
  };

  const onSelectHistory = (item: HistoryItem) => {
    const i = SCENES.findIndex((s) => s.id === item.sceneId);
    if (i >= 0) goToScene(i, { manual: true });
    if (isNarrow) setHistoryOpen(false);
  };

  const emptyHint =
    phase === "to-pill" || phase === "open-picker" || phase === "to-option" || phase === "select"
      ? `Selecting ${scene.name}…`
      : phase === "typing" || phase === "to-input" || phase === "to-send"
        ? "Composing search…"
        : "Ask across Claude, ChatGPT, Perplexity…";

  return (
    <section
      ref={rootRef}
      className={styles.root}
      style={{ "--gac-accent": scene.accent } as CSSProperties}
      aria-labelledby={labelId}
      tabIndex={0}
      onMouseEnter={() => {
        pausedRef.current = true;
        cursorAnimRef.current?.pause();
        setPaused(true);
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        setPaused(false);
        cursorAnimRef.current?.play?.();
        if (manualMode) {
          manualModeRef.current = false;
          setManualMode(false);
          setPhase(cursorDemo ? "to-pill" : "thinking");
        }
      }}
      onFocus={() => {
        pausedRef.current = true;
        cursorAnimRef.current?.pause();
        setPaused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          pausedRef.current = false;
          setPaused(false);
          cursorAnimRef.current?.play?.();
        }
      }}
    >
      <p id={labelId} className="sr-only">
        Animated multi-model AI chat demo across answer engines
      </p>

      <div className={styles.shellFrame}>
        <div
          className={styles.shell}
          ref={shellRef}
          data-style={scene.resultStyle}
          data-history={historyOpen ? "open" : "closed"}
        >
        {cursorDemo ? (
          <div
            ref={cursorRef}
            className={`${styles.cursor} ${showCursor ? styles.cursorOn : ""} ${cursorClick ? styles.cursorClick : ""}`}
            aria-hidden
          >
            <MacCursor />
          </div>
        ) : null}

        <header className={styles.titlebar}>
          <div className={styles.traffic} aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.brandBlock}>
            <div>
              <p className={styles.brandTitle}>GAiO Answer</p>
              <p className={styles.brandSub}>Multi-engine visibility demo</p>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          {historyOpen && isNarrow ? (
            <button
              type="button"
              className={styles.historyScrim}
              aria-label="Close history"
              onClick={() => setHistoryOpen(false)}
            />
          ) : null}

          <aside
            id={historyId}
            className={`${styles.history} ${historyOpen ? styles.historyOpen : styles.historyClosed}`}
            aria-label="Chat history"
            aria-hidden={!historyOpen}
            {...(!historyOpen ? { inert: true } : {})}
          >
            <div className={styles.historyHead}>
              <span className={styles.historyLabel}>
                <History size={14} aria-hidden />
                History
              </span>
            </div>
            <ul className={styles.historyList}>
              {history.length === 0 ? (
                <li className={styles.historyEmpty}>
                  Past searches appear here as the demo runs.
                </li>
              ) : (
                history.map((item) => {
                  const active = item.sceneId === scene.id && (showAnswer || showTyping);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.historyItem} ${active ? styles.historyItemActive : ""}`}
                        onClick={() => onSelectHistory(item)}
                      >
                        <span>
                          <strong>{item.title}</strong>
                          <small>{item.model}</small>
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>

          <div className={styles.main} ref={chatRef}>
            <div className={styles.mainHead}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={historyOpen ? "Collapse history" : "Expand history"}
                aria-expanded={historyOpen}
                aria-controls={historyId}
                onClick={() => setHistoryOpen((o) => !o)}
              >
                {historyOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
            </div>

            <div className={styles.messagesPane}>
              <div className={styles.messages} ref={messagesRef} aria-live="polite">
                {!showUser && !showTyping && !showAnswer ? (
                  <div className={styles.emptyHint}>{emptyHint}</div>
                ) : null}

                {showUser ? (
                  <div className={styles.userRow} data-user>
                    <div className={styles.userBubble}>{scene.prompt}</div>
                  </div>
                ) : null}

                {showTyping ? (
                  <div className={styles.assistantRow} data-typing>
                    <div className={styles.typingBubble} aria-label="Generating answer">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}

                {showAnswer ? (
                  <div className={styles.assistantRow}>
                    <div className={styles.assistantBubble}>
                      <p className={styles.assistantMeta}>
                        {scene.name} · {scene.resultStyle} answer
                      </p>
                      <AnswerBody scene={scene} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <footer className={styles.composer}>
              <div className={styles.composerBox} ref={inputAreaRef}>
                <div className={styles.composerTop}>
                  {composerText ? (
                    <p className={styles.composerDraft}>
                      {composerText}
                      {phase === "typing" ? <span className={styles.caretBlink} /> : null}
                    </p>
                  ) : (
                    <p className={styles.composerPlaceholder}>Ask across answer engines…</p>
                  )}
                </div>

                <div className={styles.composerBar}>
                  <button type="button" className={styles.attachBtn} tabIndex={-1} aria-hidden>
                    <Paperclip size={16} />
                  </button>

                  <div className={styles.modelWrap}>
                    <button
                      ref={pillRef}
                      type="button"
                      className={styles.modelPill}
                      aria-haspopup="listbox"
                      aria-expanded={pickerOpen}
                      aria-controls={listId}
                      onClick={() => {
                        manualModeRef.current = true;
                        pausedRef.current = true;
                        setManualMode(true);
                        setPaused(true);
                        setPickerOpen((o) => !o);
                      }}
                    >
                      <span className={styles.modelPillLabel}>{scene.modelLabel}</span>
                      <ChevronDown
                        size={14}
                        className={`${styles.caret} ${pickerOpen ? styles.caretOpen : ""}`}
                      />
                    </button>

                    <div
                      ref={menuRef}
                      id={listId}
                      className={`${styles.modelMenu} ${pickerOpen ? styles.modelMenuOpen : ""}`}
                      role="listbox"
                      aria-label="Answer engines"
                      data-menu
                      aria-hidden={!pickerOpen}
                    >
                      {SCENES.map((item, itemIndex) => {
                        const selected = itemIndex === index;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            data-model-id={item.id}
                            className={`${styles.modelItem} ${selected ? styles.modelItemActive : ""}`}
                            onClick={() => onSelectModel(itemIndex)}
                          >
                            <span>
                              <strong>{item.modelLabel}</strong>
                              <small>{item.name}</small>
                            </span>
                            {selected ? <Check size={14} className={styles.check} /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    ref={sendRef}
                    type="button"
                    className={styles.sendBtn}
                    aria-label="Send"
                    onClick={() => {
                      manualModeRef.current = true;
                      pausedRef.current = true;
                      setManualMode(true);
                      setPaused(true);
                      setPickerOpen(false);
                      setPhase("thinking");
                      window.setTimeout(() => {
                        pushHistory(scene);
                        setPhase("answer");
                      }, PHASE_MS.thinking);
                    }}
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/** Editorial statement with GEO attribute emphasis for Search Shift. */
export function GeoShiftStatement() {
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLParagraphElement>(null);
  const playedRef = useRef(false);
  const timelineRef = useRef<AnimHandle | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const marks = inner.querySelectorAll<HTMLElement>("[data-mark]");

    const finishVisible = () => {
      shell.classList.add(styles.statementReady);
      utils.set(inner, { opacity: 1, y: 0 });
      utils.set(marks, { opacity: 1, y: 0 });
    };

    if (prefersReducedMotion()) {
      finishVisible();
      return;
    }

    utils.set(inner, { opacity: 0, y: 18 });
    utils.set(marks, { opacity: 0.35, y: 6 });

    const playEntrance = () => {
      if (playedRef.current) return;
      playedRef.current = true;

      timelineRef.current?.pause();
      timelineRef.current?.cancel?.();

      const tl = createTimeline({
        defaults: { ease: EASE },
        autoplay: true,
      });
      timelineRef.current = tl as AnimHandle;

      tl.add(inner, { opacity: 1, y: 0, duration: 760 }, 0);
      tl.add(
        marks,
        { opacity: 1, y: 0, duration: 520, delay: stagger(95) },
        220,
      );

      window.setTimeout(() => {
        shell.classList.add(styles.statementReady, styles.statementPulse);
      }, 980);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        playEntrance();
      },
      { threshold: 0.2, rootMargin: "48px 0px -32px 0px" },
    );

    observer.observe(shell);

    return () => {
      observer.disconnect();
      timelineRef.current?.pause();
      timelineRef.current?.cancel?.();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={shellRef}
      data-geo-statement
      className={`${styles.statement} ${styles.statementGlass}`}
    >
      <p ref={innerRef} className={styles.statementInner}>
        GEO helps translate your knowledge into a system that is{" "}
        <span className={styles.statementMark} data-mark>
          Direct
        </span>
        ,{" "}
        <span className={styles.statementMark} data-mark>
          Corroborated
        </span>
        ,{" "}
        <span className={styles.statementMark} data-mark>
          Structurally Clear
        </span>
        , and{" "}
        <span className={styles.statementMark} data-mark>
          Ready to be Evaluated
        </span>
        .
      </p>
    </div>
  );
}
