"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { StructureFlowCollection } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

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
 * Unmounts when off-screen so the iframe WebGL scene can dispose.
 */
export function HeroStructureFlow() {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "120px", threshold: 0.05 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [host]);

  return (
    <div
      ref={setHost}
      className="hero-structure-flow"
      aria-hidden="true"
      style={FILL}
    >
      {active ? (
        <StructureFlowCollection
          variant="flux-vortex"
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
      ) : null}
    </div>
  );
}
