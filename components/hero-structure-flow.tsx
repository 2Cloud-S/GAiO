"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  buildHeroFluxSrcDoc,
  ensureFluxPreloads,
} from "@/lib/hero-flux-preloads";

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

const FILL: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
  overflow: "hidden",
  pointerEvents: "none",
  background: "#050505",
  filter: "brightness(1.45)",
};

/**
 * Official ThreeUI Flux Vortex HTML, patched for earliest visible Three.js:
 * no Tailwind/GSAP/loader gate, animate() starts when the module evaluates.
 * Disposes after first ready once scrolled far off-screen.
 */
export function HeroStructureFlow() {
  const reduceMotion = useReducedMotion();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const bootstrappedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const srcDoc = useMemo(
    () =>
      buildHeroFluxSrcDoc({
        density: mobile ? 0.65 : 1,
        size: 1.25,
        speed: 1,
      }),
    [mobile],
  );

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
    if (!active || reduceMotion) return;

    const el = iframeRef.current;
    if (!el) return;

    let cancelled = false;
    let fallbackTimer = 0;
    let settleTimer = 0;

    const markReady = () => {
      if (cancelled) return;
      setFrameReady(true);
    };

    const onLoad = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(markReady, 120);
    };

    el.addEventListener("load", onLoad);
    fallbackTimer = window.setTimeout(markReady, 3500);

    return () => {
      cancelled = true;
      el.removeEventListener("load", onLoad);
      window.clearTimeout(settleTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [active, reduceMotion, srcDoc]);

  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !active) return;
    win.postMessage(
      {
        type: "threeui-controls",
        controls: {
          speed: 1,
          size: 1.25,
          density: mobile ? 0.65 : 1,
          opacity: 1,
        },
      },
      "*",
    );
  }, [active, mobile, srcDoc]);

  return (
    <div
      ref={setHost}
      className="hero-structure-flow"
      aria-hidden="true"
      style={HOST}
    >
      {!reduceMotion && active ? (
        <div className="hero-structure-flow__live">
          <iframe
            ref={iframeRef}
            className="hero-structure-flow__frame"
            title="Flux Vortex"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            loading="eager"
            style={FILL}
          />
        </div>
      ) : null}
    </div>
  );
}
