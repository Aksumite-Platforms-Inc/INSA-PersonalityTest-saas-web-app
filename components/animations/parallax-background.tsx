"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ParallaxBackgroundProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxBackground({ children, className, speed = 0.2 }: ParallaxBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = backgroundRef.current
    if (!element || typeof window === "undefined") return

    // Create parallax effect
    gsap.to(element, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element.parentElement) {
          trigger.kill()
        }
      })
    }
  }, [speed])

  return (
    <div ref={backgroundRef} className={cn(className)}>
      {children}
    </div>
  )
}
