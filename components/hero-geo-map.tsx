"use client";

import { HeroStructureFlow } from "@/components/hero-structure-flow";

export function HeroGeoMap() {
  return (
    <div className="hero-geo-map" aria-hidden="true">
      {/* Size reserve via CSS; Flux Vortex mounts ASAP (no CSS spiral teaser). */}
      <HeroStructureFlow />
    </div>
  );
}
