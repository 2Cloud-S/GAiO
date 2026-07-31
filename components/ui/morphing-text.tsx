"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const DEFAULT_MORPH_TIME = 1.5
const DEFAULT_COOL_TIME = 0.5

/** SVG threshold + light blur — only while morphing; off when settled for crisp glyphs. */
const MORPH_CONTAINER_FILTER = "url(#threshold) blur(0.6px)"

/** blur(0px) still promotes a filter layer on some GPUs — use none when settled. */
const applyLayerBlur = (el: HTMLSpanElement, amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0.01) {
    el.style.filter = "none"
  } else {
    el.style.filter = `blur(${amount}px)`
  }
}

const useMorphingText = (
  texts: string[],
  morphTime: number,
  coolTime: number
) => {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())
  const morphTimeRef = useRef(morphTime)
  const coolTimeRef = useRef(coolTime)

  morphTimeRef.current = morphTime
  coolTimeRef.current = coolTime

  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const setContainerFilter = useCallback((active: boolean) => {
    const container = containerRef.current
    if (!container) return
    container.style.filter = active ? MORPH_CONTAINER_FILTER : "none"
  }, [])

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      // Threshold/blur on the wrapper only mid-morph; settled frames stay filter-free.
      setContainerFilter(fraction > 0 && fraction < 1)

      applyLayerBlur(current2, Math.min(8 / fraction - 8, 100))
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

      const invertedFraction = 1 - fraction
      applyLayerBlur(current1, Math.min(8 / invertedFraction - 8, 100))
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`

      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
    },
    [texts, setContainerFilter]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / morphTimeRef.current

    if (fraction > 1) {
      cooldownRef.current = coolTimeRef.current
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1) {
      textIndexRef.current++
    }
  }, [setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const [current1, current2] = [text1Ref.current, text2Ref.current]
    if (current1 && current2) {
      // Settled: no blur/filter on layers or wrapper — sharp text paint.
      setContainerFilter(false)
      current2.style.filter = "none"
      current2.style.opacity = "100%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
    }
  }, [setContainerFilter])

  useEffect(() => {
    let animationFrameId = 0
    let running = false
    const inViewRef = { current: true }

    const tick = () => {
      if (!inViewRef.current) {
        running = false
        doCooldown()
        return
      }

      animationFrameId = requestAnimationFrame(tick)

      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime

      cooldownRef.current -= dt

      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }

    const start = () => {
      if (running) return
      running = true
      timeRef.current = new Date()
      tick()
    }

    const host = containerRef.current
    const observer =
      typeof IntersectionObserver !== "undefined" && host
        ? new IntersectionObserver(
            ([entry]) => {
              inViewRef.current = entry.isIntersecting
              if (entry.isIntersecting) start()
              else {
                cancelAnimationFrame(animationFrameId)
                running = false
                doCooldown()
              }
            },
            { rootMargin: "80px 0px", threshold: 0.01 }
          )
        : null

    if (observer && host) observer.observe(host)
    start()

    return () => {
      observer?.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown])

  return { text1Ref, text2Ref, containerRef }
}

interface MorphingTextProps {
  className?: string
  texts: string[]
  /** Duration of the blur morph between phrases (seconds). */
  morphTime?: number
  /** Dwell time each phrase stays fully readable (seconds). */
  coolTime?: number
}

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  morphTime = DEFAULT_MORPH_TIME,
  coolTime = DEFAULT_COOL_TIME,
}) => {
  const { text1Ref, text2Ref, containerRef } = useMorphingText(
    texts,
    morphTime,
    coolTime
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        // No permanent filter — Magic UI's threshold+blur was left on forever and soft-blurred settled text.
        "relative mx-auto h-16 w-full max-w-3xl text-center font-sans text-[40pt] leading-none font-bold antialiased md:h-24 lg:text-[6rem]",
        className
      )}
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "geometricPrecision",
      }}
    >
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
      <SvgFilters />
    </div>
  )
}
