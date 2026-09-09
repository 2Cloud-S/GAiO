/**
 * Build a Flux Vortex iframe srcDoc tuned for earliest visible Three.js.
 *
 * Upstream ThreeUI HTML blocks on Tailwind / Iconify / GSAP / fonts, then only
 * starts the render loop in `window.onload` behind a 1s loader fade. Those
 * chrome layers are discarded by ThreeUI isolation anyway — strip them and
 * start `animate()` as soon as the module runs.
 */
import fluxVortexHtml from "@designcodeio/threeui/lib-dist/shaders/neuform-isolated/sources/flux-vortex.html.js";

const THREE_CDN = "https://unpkg.com/three@0.160.0";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scaleCount(base: number, density: number, floor: number) {
  return Math.max(floor, Math.round(base * density));
}

export type HeroFluxSrcDocOptions = {
  density?: number;
  size?: number;
  speed?: number;
  /** Prefer same-origin copies under /vendor when present. */
  localThreeBase?: string;
};

const BOOT_PATCH = `
<script data-hero-flux-boot>
(function () {
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var canvas = document.querySelector('#webgl-canvas');
    if (!canvas) return;
    isolated = true;
    canvas.setAttribute('data-threeui-role', 'background');
    document.body.appendChild(canvas);
    Array.from(document.body.children).forEach(function (el) {
      if (el === canvas) return;
      el.setAttribute('data-threeui-residual', '');
      el.setAttribute('aria-hidden', 'true');
      if ('inert' in el) el.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    if (window.__SF_APPLY_CONTROLS) window.__SF_APPLY_CONTROLS();
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  // Isolate as soon as the canvas exists — do not wait for load / CDN leftovers.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', isolate, { once: true });
  } else {
    isolate();
  }
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;

const CONTROLS_SCRIPT = (speed: number) => `
<script data-threeui-controls>
(function () {
  var controls = { speed: ${speed}, opacity: 1, size: 1 };
  window.__SF_CONTROLS = controls;
  var origin = performance.now();
  var virtual = 0;
  var last = origin;
  var performanceNow = performance.now.bind(performance);
  performance.now = function () {
    var real = performanceNow();
    virtual += (real - last) * (controls.speed || 1);
    last = real;
    return origin + virtual;
  };
  var raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (callback) {
    return raf(function () { callback(performance.now()); });
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'threeui-controls') return;
    var next = event.data.controls || {};
    Object.keys(next).forEach(function (key) { controls[key] = next[key]; });
  });
  window.__SF_APPLY_CONTROLS = function () {};
})();
</script>`;

const FOCUS_STYLE = `
<style data-threeui-focus>
html, body {
  width: 100% !important; height: 100% !important; min-height: 0 !important;
  margin: 0 !important; padding: 0 !important; overflow: hidden !important;
  background: transparent !important;
  box-shadow: none !important;
}
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-role="background"] {
  position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important;
  max-width: none !important; max-height: none !important; z-index: 0 !important;
  opacity: 1 !important; pointer-events: none !important;
  background: transparent !important;
  box-shadow: none !important;
  filter: none !important;
}
</style>`;

export function buildHeroFluxSrcDoc({
  density = 1,
  size = 1,
  speed = 1,
  localThreeBase,
}: HeroFluxSrcDocOptions = {}): string {
  const d = clamp(density, 0.25, 2.5);
  const s = clamp(size, 0.05, 200);
  const sp = clamp(speed, 0, 3);
  const threeBase = localThreeBase?.replace(/\/$/, "") || THREE_CDN;

  let html = String(fluxVortexHtml);

  // Density / point size (same formula as ThreeUI FluxVortex patch).
  html = html
    .replace(
      "const vortexCount = 9500;",
      `const vortexCount = ${scaleCount(9500, d, 1200)};`,
    )
    .replace(
      "const particlesCount = 300;",
      `const particlesCount = ${scaleCount(300, d, 40)};`,
    )
    .replace(
      "size: 0.006, // Smaller dots requested",
      `size: ${Number((6e-3 * s).toFixed(4))}, // Smaller dots requested`,
    )
    .replace("size: 0.008,", `size: ${Number((8e-3 * s).toFixed(4))},`);

  // Drop blocking / unused chrome CDNs — they only delay window load.
  html = html
    .replace(
      /\s*<!-- Tailwind & Iconify -->[\s\S]*?<!-- Fonts -->[\s\S]*?<link[^>]*>\s*/i,
      "\n",
    )
    .replace(
      /\s*<!-- GSAP Core & ScrollTrigger -->[\s\S]*?<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>\s*/i,
      "\n",
    )
    .replace(
      /<!-- Loading Overlay -->[\s\S]*?<!-- 3D Canvas Container -->/i,
      "<!-- 3D Canvas Container -->",
    );

  // Point import map at preferred Three base (CDN or local vendor).
  html = html.replace(
    /"three": "https:\/\/unpkg\.com\/three@0\.160\.0\/build\/three\.module\.js"/,
    `"three": "${threeBase}/build/three.module.js"`,
  );
  html = html.replace(
    /"three\/addons\/": "https:\/\/unpkg\.com\/three@0\.160\.0\/examples\/jsm\/"/,
    `"three/addons/": "${threeBase}/examples/jsm/"`,
  );

  // GSAP is gone — remove register + onload gate; start rendering immediately.
  html = html.replace(
    /\s*\/\/ Register GSAP ScrollTrigger\s*gsap\.registerPlugin\(ScrollTrigger\);\s*/i,
    "\n",
  );
  html = html.replace(
    /\/\/ --- Init & GSAP Animations ---[\s\S]*?window\.onload = \(\) => \{[\s\S]*?\};\s*/i,
    `// --- Start as soon as the module evaluates (no window.onload gate) ---
        animate();
`,
  );

  // Sandboxed iframe WebGL stays opaque — match mosaic mid-tone; skip bloom present path.
  html = html.replace(
    "scene.background = new THREE.Color(config.colors.bg);\n        scene.fog = new THREE.FogExp2(config.colors.bg, 0.04);",
    "scene.background = new THREE.Color(0x2e2e2e);\n        scene.fog = null;",
  );
  html = html.replace(
    `const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            powerPreference: "high-performance",
            alpha: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;`,
    `const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            powerPreference: "high-performance",
            alpha: false
        });
        renderer.setClearColor(0x2e2e2e, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.autoClear = true;`,
  );
  html = html.replace(
    /\/\/ --- Post Processing ---[\s\S]*?composer\.addPass\(bloomPass\);/,
    `// --- No postprocessing (avoids opaque black present path) ---
        const composer = { setSize: function () {}, render: function () {} };`,
  );
  html = html.replace(
    "composer.render();",
    "renderer.setClearColor(0x2e2e2e, 1);\n            renderer.render(scene, camera);",
  );
  html = html.replace(
    "opacity: 0.6,\n            blending: THREE.AdditiveBlending,",
    "opacity: 0.9,\n            blending: THREE.AdditiveBlending,",
  );
  html = html.replace(
    "opacity: 0.15,\n                blending: THREE.AdditiveBlending",
    "opacity: 0.32,\n                blending: THREE.AdditiveBlending",
  );

  // Inject focus CSS + controls + early isolate into head / before </body>.
  html = html.replace(/<head([^>]*)>/i, `<head$1>${FOCUS_STYLE}${CONTROLS_SCRIPT(sp)}`);
  html = html.replace(/<\/body>/i, `${BOOT_PATCH}</body>`);

  return html;
}

export const HERO_FLUX_THREE_URLS = {
  module: `${THREE_CDN}/build/three.module.js`,
  effectComposer: `${THREE_CDN}/examples/jsm/postprocessing/EffectComposer.js`,
  renderPass: `${THREE_CDN}/examples/jsm/postprocessing/RenderPass.js`,
  unrealBloom: `${THREE_CDN}/examples/jsm/postprocessing/UnrealBloomPass.js`,
} as const;
