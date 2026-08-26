import { preload, preloadModule } from "react-dom";

/** CDN URLs the Flux Vortex iframe pulls in — warm the shared HTTP cache early. */
export const FLUX_PRELOADS: ReadonlyArray<{
  rel: "modulepreload" | "preload";
  href: string;
  as?: "script";
}> = [
  {
    rel: "modulepreload",
    href: "https://unpkg.com/three@0.160.0/build/three.module.js",
  },
  {
    rel: "modulepreload",
    href: "https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js",
  },
  {
    rel: "modulepreload",
    href: "https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js",
  },
  {
    rel: "modulepreload",
    href: "https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js",
  },
  {
    rel: "preload",
    href: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
    as: "script",
  },
  {
    rel: "preload",
    href: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
    as: "script",
  },
  {
    rel: "preload",
    href: "https://cdn.tailwindcss.com",
    as: "script",
  },
];

/**
 * Server-safe: emit React preload hints into the document head for the
 * current request (homepage). Starts CDN fetch before client JS runs.
 */
export function warmFluxPreloads() {
  for (const item of FLUX_PRELOADS) {
    if (item.rel === "modulepreload") {
      preloadModule(item.href, { as: "script", crossOrigin: "anonymous" });
    } else {
      preload(item.href, {
        as: item.as ?? "script",
        crossOrigin: "anonymous",
      });
    }
  }
}

/** Inject once on the client; safe to call from multiple hero entry points. */
export function ensureFluxPreloads() {
  if (typeof document === "undefined") return;

  for (const item of FLUX_PRELOADS) {
    const already = Array.from(
      document.head.querySelectorAll("link[data-hero-flux-preload]"),
    ).some((link) => link.getAttribute("href") === item.href);
    if (already) continue;

    const link = document.createElement("link");
    link.rel = item.rel;
    link.href = item.href;
    link.dataset.heroFluxPreload = "true";
    link.crossOrigin = "anonymous";
    if (item.as) link.as = item.as;
    document.head.appendChild(link);
  }
}
