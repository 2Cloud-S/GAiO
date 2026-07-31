"use client"

import { useLayoutEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

import { cn } from "@/lib/utils"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  className?: string
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!shouldShow || !element) return

    // Strip any leftover rough-notation SVG from a prior mount / Strict Mode pass
    // so hide/show races cannot leave a black stroke fragment over the text.
    const previous = element.previousElementSibling
    if (previous?.classList.contains("rough-annotation")) {
      previous.remove()
    }

    const annotation: RoughAnnotation = annotate(element, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    })

    annotation.show()

    // rough-notation already observes resize on the annotated element.
    // A second hide()/show() observer was racing it and leaving orphan strokes.

    return () => {
      annotation.remove()
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  return (
    <span
      ref={elementRef}
      className={cn(
        "relative max-w-full bg-transparent align-baseline",
        // inline wraps cleanly for multiline highlights; inline-block for single tokens
        multiline ? "inline" : "inline-block",
        className
      )}
    >
      {children}
    </span>
  )
}
