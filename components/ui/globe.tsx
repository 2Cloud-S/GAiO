"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

/** Dark monochrome defaults for Signal / Proof ink panels. */
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.92, 0.92, 0.92],
  markerColor: [0.88, 0.88, 0.88],
  glowColor: [0.12, 0.12, 0.12],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

function mobileGlobeTuning(): Pick<COBEOptions, "devicePixelRatio" | "mapSamples"> {
  if (typeof window === "undefined") {
    return { devicePixelRatio: 2, mapSamples: 16000 }
  }
  const narrow = window.matchMedia("(max-width: 800px)").matches
  return narrow
    ? { devicePixelRatio: 1, mapSamples: 8000 }
    : { devicePixelRatio: 2, mapSamples: 16000 }
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const reduceMotion = useReducedMotion()
  const reduceMotionRef = useRef(reduceMotion)
  reduceMotionRef.current = reduceMotion
  const [active, setActive] = useState(false)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  // Only run the WebGL globe while near the viewport
  useEffect(() => {
    const host = containerRef.current
    if (!host || typeof IntersectionObserver === "undefined") {
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 }
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const tuning = mobileGlobeTuning()
    const globe = createGlobe(canvasRef.current, {
      ...config,
      ...tuning,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current && !reduceMotionRef.current) {
          phiRef.current += 0.005
        }
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    const fade = window.setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1"
    }, 0)

    return () => {
      window.clearTimeout(fade)
      globe.destroy()
      window.removeEventListener("resize", onResize)
      if (canvasRef.current) canvasRef.current.style.opacity = "0"
    }
  }, [active, rs, config])

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
