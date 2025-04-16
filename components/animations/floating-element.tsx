"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
  delay?: number
}

export function FloatingElement({ children, className, duration = 3, distance = 15, delay = 0 }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof window === "undefined") return

    // Create floating animation
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "sine.inOut" },
    })

    tl.to(element, {
      y: `-=${distance}`,
      duration,
      delay,
    })

    // Store timeline for cleanup
    timelineRef.current = tl

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [distance, duration, delay])

  return (
    <div ref={elementRef} className={cn(className)}>
      {children}
    </div>
  )
}
