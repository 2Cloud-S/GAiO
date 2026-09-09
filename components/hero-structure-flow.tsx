"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  mountHeroFluxVortex,
  type HeroFluxHandle,
} from "@/lib/hero-flux-vortex";

const MOBILE_QUERY = "(max-width: 800px)";

/**
 * Host renders larger than the map, then scales down (supersample).
 * Flux Vortex uses antialias:false — CSS upscale was blurry; downscale stays crisp.
 * 137.5% × 0.8 ≈ 110% visual fill (same crop as the old scale: 1.1).
 */
const HOST: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "137.5%",
  height: "137.5%",
  transform: "translate(-50%, -50%) scale(0.8)",
  transformOrigin: "center center",
  border: 0,
  overflow: "hidden",
  pointerEvents: "none",
  background: "transparent",
};

const CANVAS: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
  border: 0,
  pointerEvents: "none",
  background: "transparent",
};

/**
 * In-page Flux Vortex (transparent WebGL) so the hero mosaic shows through.
 * Disposes after first ready once scrolled far off-screen.
 */
export function HeroStructureFlow() {
  const reduceMotion = useReducedMotion();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);
  const bootstrappedRef = useRef(false);
  const handleRef = useRef<HeroFluxHandle | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
        if (bootstrappedRef.current) setActive(false);
      },
      { rootMargin: "200px", threshold: 0 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [host, reduceMotion]);

  useEffect(() => {
    if (!active || reduceMotion || !canvasEl) {
      handleRef.current?.dispose();
      handleRef.current = null;
      return;
    }

    let cancelled = false;
    let handle: HeroFluxHandle | null = null;
    let ro: ResizeObserver | null = null;

    try {
      handle = mountHeroFluxVortex(canvasEl, {
        density: mobile ? 0.65 : 1,
        size: 1.25,
        speed: 1,
      });
    } catch (err) {
      console.error("[HeroStructureFlow] mount failed", err);
      return;
    }

    if (cancelled) {
      handle.dispose();
      return;
    }

    handleRef.current = handle;
    bootstrappedRef.current = true;
    canvasEl.dataset.heroFlux = "mounted";

    const onResize = () => handle?.resize();
    window.addEventListener("resize", onResize);
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(canvasEl.parentElement ?? canvasEl);
    }
    onResize();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      handle?.dispose();
      if (handleRef.current === handle) handleRef.current = null;
      if (canvasEl.dataset.heroFlux === "mounted") {
        delete canvasEl.dataset.heroFlux;
      }
    };
  }, [active, reduceMotion, mobile, canvasEl]);

  return (
    <div
      ref={setHost}
      className="hero-structure-flow"
      aria-hidden="true"
      style={HOST}
    >
      {!reduceMotion && active ? (
        <div className="hero-structure-flow__live">
          <canvas
            ref={setCanvasEl}
            className="hero-structure-flow__canvas"
            style={CANVAS}
          />
        </div>
      ) : null}
    </div>
  );
}
