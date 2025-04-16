"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type AnimationType = "fadeIn" | "slideUp" | "slideRight" | "slideLeft" | "scale"

interface AnimatedTextProps {
  text: string
  tag?: keyof JSX.IntrinsicElements
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export function AnimatedText({
  text,
  tag = "h2",
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.2,
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null)
  const Tag = tag as keyof JSX.IntrinsicElements

  useEffect(() => {
    const element = textRef.current
    if (!element || typeof window === "undefined") return

    let animationConfig: gsap.TweenVars = {}

    // Set initial state based on animation type
    switch (animation) {
      case "fadeIn":
        gsap.set(element, { opacity: 0 })
        animationConfig = { opacity: 1, duration }
        break
      case "slideUp":
        gsap.set(element, { opacity: 0, y: 30 })
        animationConfig = { opacity: 1, y: 0, duration }
        break
      case "slideRight":
        gsap.set(element, { opacity: 0, x: -30 })
        animationConfig = { opacity: 1, x: 0, duration }
        break
      case "slideLeft":
        gsap.set(element, { opacity: 0, x: 30 })
        animationConfig = { opacity: 1, x: 0, duration }
        break
      case "scale":
        gsap.set(element, { opacity: 0, scale: 0.8 })
        animationConfig = { opacity: 1, scale: 1, duration }
        break
    }

    // Add ease to animation config
    animationConfig.ease = "power3.out"
    animationConfig.delay = delay

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: `top bottom-=${threshold * 100}%`,
      onEnter: () => gsap.to(element, animationConfig),
      once,
    })

    return () => {
      trigger.kill()
    }
  }, [animation, delay, duration, once, threshold])

  return (
    <Tag ref={textRef} className={cn(className)}>
      {text}
    </Tag>
  )
}
