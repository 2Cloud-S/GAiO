"use client"

import { type CSSProperties, type HTMLAttributes } from "react"
import {
  motion,
  type DOMMotionComponents,
  type MotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>

interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>, MotionProps {
  children: string
  shadowColor?: string
  as?: MotionElementType
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component]
  const characters = Array.from(children)

  return (
    <MotionComponent
      className={cn("relative inline", className)}
      aria-label={children}
      {...props}
    >
      {characters.map((char, index) => (
        <span
          key={`${index}-${char}`}
          aria-hidden="true"
          data-text={char}
          style={
            {
              "--shadow-color": shadowColor,
              zIndex: index + 1,
            } as CSSProperties
          }
          className={cn(
            "relative inline-block whitespace-pre",
            // Keep each glyph + its hatched shadow as one stacking unit so later
            // letters cover earlier shadows (tight tracking / line overlap).
            "after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]",
            "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
            "after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent",
            "after:animate-line-shadow"
          )}
        >
          {char}
        </span>
      ))}
    </MotionComponent>
  )
}
