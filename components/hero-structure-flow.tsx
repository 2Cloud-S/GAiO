"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "motion/react";
import { FluxVortex } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { HeroVortexPlaceholder } from "@/components/hero-vortex-placeholder";
import { ensureFluxPreloads } from "@/lib/hero-flux-preloads";

const MOBILE_QUERY = "(max-width: 800px)";

const FILL: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
  overflow: "hidden",
  pointerEvents: "none",
  background: "transparent",
};

/**
 * Official ThreeUI Flux Vortex for the hero visual column.
 * Mounts immediately for first paint; only disposes after the first ready
 * cycle once scrolled far off-screen (so below-fold heroes still boot eagerly).
 */
export function HeroStructureFlow() {
  const reduceMotion = useReducedMotion();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    ensureFluxPreloads();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (frameReady) bootstrappedRef.current = true;
  }, [frameReady]);

  // Dispose only after first successful boot — never gate the initial hero mount.
  useEffect(() => {
    if (!host || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = Boolean(entry?.isIntersecting);
        if (inView) {
          setActive(true);
          return;
        }
        // Keep loading while the iframe boots even if the map starts below the fold.
        if (bootstrappedRef.current) setActive(false);
      },
      { rootMargin: "200px", threshold: 0 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [host, reduceMotion]);

  useEffect(() => {
    if (!active) setFrameReady(false);
  }, [active]);

  // Iframe is sandboxed without allow-same-origin, so detect readiness via load.
  useEffect(() => {
    if (!host || !active || reduceMotion) return;

    let cancelled = false;
    let fallbackTimer = 0;
    let settleTimer = 0;
    let iframe: HTMLIFrameElement | null = null;

    const markReady = () => {
      if (cancelled) return;
      setFrameReady(true);
    };

    const onLoad = () => {
      window.clearTimeout(settleTimer);
      // ThreeUI isolates the canvas ~100ms after DOMContentLoaded / load.
      settleTimer = window.setTimeout(markReady, 180);
    };

    const armIframe = (el: HTMLIFrameElement) => {
      if (iframe === el) return;
      if (iframe) iframe.removeEventListener("load", onLoad);
      iframe = el;
      el.addEventListener("load", onLoad);
      // srcDoc may already be complete when we attach (SSR / fast path).
      try {
        const doc = el.contentDocument;
        if (doc && doc.readyState === "complete") onLoad();
      } catch {
        // Sandbox without allow-same-origin — contentDocument is opaque; wait for load.
      }
    };

    const existing = host.querySelector("iframe");
    if (existing instanceof HTMLIFrameElement) {
      armIframe(existing);
    }

    const mo = new MutationObserver(() => {
      const next = host.querySelector("iframe");
      if (next instanceof HTMLIFrameElement) armIframe(next);
    });
    mo.observe(host, { childList: true, subtree: true });

    // Last-resort if the load event was missed after late attachment.
    fallbackTimer = window.setTimeout(markReady, 4500);

    return () => {
      cancelled = true;
      mo.disconnect();
      if (iframe) iframe.removeEventListener("load", onLoad);
      window.clearTimeout(settleTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [host, active, reduceMotion]);

  return (
    <div
      ref={setHost}
      className={
        frameReady
          ? "hero-structure-flow is-vortex-ready"
          : "hero-structure-flow"
      }
      aria-hidden="true"
      style={FILL}
    >
      <HeroVortexPlaceholder />
      {!reduceMotion && active ? (
        <div
          className={
            frameReady
              ? "hero-structure-flow__live is-ready"
              : "hero-structure-flow__live"
          }
        >
          <FluxVortex
            mode="dark"
            speed={1}
            size={1.25}
            length={1}
            density={mobile ? 0.65 : 1}
            opacity={1}
            hue={0}
            saturation={0}
            brightness={1.45}
            className="hero-structure-flow__frame"
            style={FILL}
          />
        </div>
      ) : null}
    </div>
  );
}
