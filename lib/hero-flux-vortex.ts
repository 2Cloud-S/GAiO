/**
 * In-page Flux Vortex (Three.js) with a transparent WebGL buffer so the hero
 * mosaic shows through — no sandboxed iframe opaque plate.
 */
import * as THREE from "three";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scaleCount(base: number, density: number, floor: number) {
  return Math.max(floor, Math.round(base * density));
}

export type HeroFluxOptions = {
  density?: number;
  size?: number;
  speed?: number;
};

export type HeroFluxHandle = {
  setOptions: (next: Partial<HeroFluxOptions>) => void;
  resize: () => void;
  dispose: () => void;
};

const COLORS = {
  primary: 0xdddddd,
  secondary: 0x555555,
} as const;

export function mountHeroFluxVortex(
  canvas: HTMLCanvasElement,
  initial: HeroFluxOptions = {},
): HeroFluxHandle {
  let density = clamp(initial.density ?? 1, 0.25, 2.5);
  let sizeMul = clamp(initial.size ?? 1, 0.05, 200);
  let speed = clamp(initial.speed ?? 1, 0, 3);

  const scene = new THREE.Scene();
  // Transparent — mosaic shows through; never set scene.background.
  scene.background = null;
  scene.fog = null;

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
    alpha: true,
    premultipliedAlpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setClearAlpha(0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.autoClear = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  const vortexCount = scaleCount(9500, density, 1200);
  const vortexPositions = new Float32Array(vortexCount * 3);
  const vortexRadius = new Float32Array(vortexCount);
  const vortexAngle = new Float32Array(vortexCount);
  const vortexHeight = new Float32Array(vortexCount);
  const vortexSpeed = new Float32Array(vortexCount);

  for (let i = 0; i < vortexCount; i++) {
    const i3 = i * 3;
    const y = (Math.random() - 0.5) * 7.5;
    const funnel = 0.4 + Math.abs(y) * 0.2;
    const r = (0.1 + Math.pow(Math.random(), 1.5) * 2.5) * funnel;
    const a = Math.random() * Math.PI * 2;

    vortexHeight[i] = y;
    vortexRadius[i] = r;
    vortexAngle[i] = a;
    vortexSpeed[i] = 0.5 + Math.random() * 0.8;

    vortexPositions[i3] = Math.cos(a) * r;
    vortexPositions[i3 + 1] = y;
    vortexPositions[i3 + 2] = Math.sin(a) * r;
  }

  const vortexGeometry = new THREE.BufferGeometry();
  vortexGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vortexPositions, 3),
  );
  const vortexMaterial = new THREE.PointsMaterial({
    size: Number((6e-3 * sizeMul).toFixed(4)),
    color: COLORS.primary,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const vortexPoints = new THREE.Points(vortexGeometry, vortexMaterial);
  mainGroup.add(vortexPoints);

  function createSpiralLine(turnOffset: number, color: number) {
    const spiralPoints: THREE.Vector3[] = [];
    const pointCount = 400;
    for (let i = 0; i < pointCount; i++) {
      const t = i / (pointCount - 1);
      const angle = t * Math.PI * 14 + turnOffset;
      const radius = 0.2 + t * 2.8;
      const y = (0.5 - t) * 6.0;
      spiralPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ),
      );
    }
    const spiralGeometry = new THREE.BufferGeometry().setFromPoints(
      spiralPoints,
    );
    const spiralMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(spiralGeometry, spiralMaterial);
  }

  const spiralLineA = createSpiralLine(0, COLORS.secondary);
  const spiralLineB = createSpiralLine(Math.PI, COLORS.primary);
  mainGroup.add(spiralLineA);
  mainGroup.add(spiralLineB);

  const particlesCount = scaleCount(300, density, 40);
  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 12;
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3),
  );
  // Ambient field kept sparse — dense additive haze can read as a grey plate.
  const particlesMaterial = new THREE.PointsMaterial({
    size: Number((8e-3 * sizeMul).toFixed(4)),
    color: COLORS.secondary,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let halfW = 1;
  let halfH = 1;
  let raf = 0;
  let disposed = false;
  const clock = new THREE.Clock();

  const onMouseMove = (event: MouseEvent) => {
    mouseX = event.clientX - halfW;
    mouseY = event.clientY - halfH;
  };
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  function resize() {
    const parent = canvas.parentElement;
    const w = Math.max(1, parent?.clientWidth ?? canvas.clientWidth);
    const h = Math.max(1, parent?.clientHeight ?? canvas.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    halfW = window.innerWidth / 2;
    halfH = window.innerHeight / 2;
  }

  function animate() {
    if (disposed) return;
    const elapsedTime = clock.getElapsedTime() * speed;

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.0008;

    mainGroup.rotation.y += 0.002;
    mainGroup.rotation.y += 0.03 * (targetX - mainGroup.rotation.y);
    mainGroup.rotation.x += 0.03 * (targetY - mainGroup.rotation.x);

    const positions = vortexGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < vortexCount; i++) {
      const i3 = i * 3;
      const spin = elapsedTime * vortexSpeed[i] * 0.5 + vortexHeight[i] * 0.5;
      const angle = vortexAngle[i] + spin;
      const pulse = Math.sin(elapsedTime * 1.2 + i * 0.01) * 0.05;
      const radius = vortexRadius[i] + pulse;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] =
        vortexHeight[i] + Math.sin(elapsedTime + i * 0.02) * 0.03;
      positions[i3 + 2] = Math.sin(angle) * radius;
    }
    vortexGeometry.attributes.position.needsUpdate = true;

    spiralLineA.rotation.y = elapsedTime * 0.15;
    spiralLineB.rotation.y = -elapsedTime * 0.12;

    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = -mouseY * 0.0001;

    renderer.setClearColor(0x000000, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  resize();
  raf = requestAnimationFrame(animate);

  return {
    setOptions(next) {
      if (next.speed != null) speed = clamp(next.speed, 0, 3);
      if (next.size != null) {
        sizeMul = clamp(next.size, 0.05, 200);
        vortexMaterial.size = Number((6e-3 * sizeMul).toFixed(4));
        particlesMaterial.size = Number((8e-3 * sizeMul).toFixed(4));
      }
      // Density rebuilds geometry — skip live changes; remount on mobile toggle.
    },
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      vortexGeometry.dispose();
      vortexMaterial.dispose();
      spiralLineA.geometry.dispose();
      (spiralLineA.material as THREE.Material).dispose();
      spiralLineB.geometry.dispose();
      (spiralLineB.material as THREE.Material).dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    },
  };
}
