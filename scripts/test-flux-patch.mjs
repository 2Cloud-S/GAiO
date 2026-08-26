import html from "@designcodeio/threeui/lib-dist/shaders/neuform-isolated/sources/flux-vortex.html.js";

let h = String(html);
const before = h.length;
h = h.replace(
  /\s*<!-- Tailwind & Iconify -->[\s\S]*?<!-- Fonts -->[\s\S]*?<link[^>]*>\s*/i,
  "\n",
);
h = h.replace(
  /\s*<!-- GSAP Core & ScrollTrigger -->[\s\S]*?<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>\s*/i,
  "\n",
);
h = h.replace(
  /<!-- Loading Overlay -->[\s\S]*?<!-- 3D Canvas Container -->/i,
  "<!-- 3D Canvas Container -->",
);
h = h.replace(
  /\s*\/\/ Register GSAP ScrollTrigger\s*gsap\.registerPlugin\(ScrollTrigger\);\s*/i,
  "\n",
);
const onloadBefore = h.includes("window.onload");
h = h.replace(
  /\/\/ --- Init & GSAP Animations ---[\s\S]*?window\.onload = \(\) => \{[\s\S]*?\};\s*/i,
  "// boot\nanimate();\n",
);
console.log(
  JSON.stringify(
    {
      before,
      after: h.length,
      hasTailwind: h.includes("cdn.tailwindcss.com"),
      hasGsap: h.includes("gsap.min.js"),
      hasLoader: h.includes("Booting Sequence"),
      hasOnload: h.includes("window.onload"),
      hasAnimate: h.includes("animate();"),
      onloadBefore,
    },
    null,
    2,
  ),
);
