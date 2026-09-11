"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Pixel stars rising out of the search-shift field into the hero.
 * Each block appears from the blueprint background and shoots upward.
 */

type Star = {
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  travel: number;
  originY: number;
  drift: number;
};

const COLORS = [
  "#ffffff",
  "#f3f3f3",
  "#e4e4e2",
  "#c45c26",
  "#d4784a",
  "#2e2e2e",
  "#141414",
  "#b8b8b4",
];

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function pickColor(r: number) {
  return COLORS[Math.floor(r * COLORS.length) % COLORS.length]!;
}

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

function buildStars(width: number, height: number, cell: number): Star[] {
  /* Sparse enough to read as individual rising blocks, not a filled band. */
  const count = Math.round((width / cell) * 3.2);
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const r0 = hash(i * 17.3 + 1);
    const r1 = hash(i * 41.7 + 3);
    const r2 = hash(i * 93.1 + 7);
    const r3 = hash(i * 13.9 + 11);
    const r4 = hash(i * 61.2 + 19);

    /* Spawn deep in the lower canvas - over the search-shift field. */
    const originY = height * (0.72 + r0 * 0.26);

    stars.push({
      x: r1 * width,
      size: Math.max(2, Math.round(cell * (0.65 + r2 * 0.85))),
      color: pickColor(r3),
      delay: r4 * 8.5,
      duration: 3.2 + r2 * 4.5,
      travel: height * (0.85 + r1 * 0.55),
      originY,
      drift: (r0 - 0.5) * cell * 2.4,
    });
  }

  return stars;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function HeroPixelSeam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    let stars: Star[] = [];
    let raf = 0;
    let cell = 4;
    let visible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      cell = width < 640 ? 3 : width < 1100 ? 4 : 5;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = buildStars(width, height, cell);
      paint(performance.now());
    };

    const paint = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = timeMs * 0.001;

      if (reducedMotion) {
        for (const s of stars) {
          if (hash(s.x * 0.01 + s.originY) > 0.55) continue;
          const y = s.originY - s.travel * 0.12;
          ctx.fillStyle = hexToRgba(s.color, 0.28);
          ctx.fillRect(s.x, y, s.size - 0.3, s.size - 0.3);
        }
        return;
      }

      for (const s of stars) {
        const cycle = ((t + s.delay) % s.duration) / s.duration;
        /* Hold dark between launches so the field isn't constantly packed. */
        if (cycle > 0.72) continue;

        const riseT = cycle / 0.72;
        const rise = easeOutQuart(riseT);
        const y = s.originY - s.travel * rise;
        const x = s.x + s.drift * rise;

        /* Pop out of the field, peak mid-flight, dissolve into the hero. */
        let alpha = 0;
        if (riseT < 0.08) alpha = riseT / 0.08;
        else if (riseT < 0.35) alpha = 1;
        else alpha = Math.max(0, 1 - (riseT - 0.35) / 0.65);

        /* Dimmer while still nested in the blueprint, brighter as they leave. */
        const depth = Math.min(1, rise * 1.4);
        alpha *= 0.2 + depth * 0.75;
        if (alpha < 0.03) continue;

        /* Short upward trail (drawn below the head = behind the motion). */
        const trail = 3;
        for (let k = trail; k >= 0; k--) {
          const ty = y + k * s.size * 0.95;
          if (ty < -s.size || ty > height + s.size) continue;
          const ta = alpha * (k === 0 ? 1 : 0.28 * (1 - k / (trail + 1)));
          ctx.fillStyle = hexToRgba(s.color, ta);
          ctx.fillRect(x, ty, s.size - 0.25, s.size - 0.25);
        }
      }
    };

    const loop = (now: number) => {
      if (visible) paint(now);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { rootMargin: "160px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);
    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="hero-pixel-seam" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-pixel-seam__canvas" />
    </div>
  );
}
