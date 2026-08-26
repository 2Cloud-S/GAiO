"use client";

import { HeroStructureFlow } from "@/components/hero-structure-flow";
import { ensureFluxPreloads } from "@/lib/hero-flux-preloads";

/** Warm Three.js CDN as soon as the homepage hero client module evaluates. */
if (typeof window !== "undefined") {
  ensureFluxPreloads();
}

export function HeroGeoMap() {
  return (
    <div className="hero-geo-map" aria-hidden="true">
      {/* Size reserve via CSS; Flux Vortex mounts ASAP (no CSS spiral teaser). */}
      <HeroStructureFlow />
    </div>
  );
}
