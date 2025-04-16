"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register ScrollTrigger plugin only on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CounterProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  triggerOnce?: boolean
}

export function Counter({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  triggerOnce = true,
}: CounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(start)
  const hasAnimated = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const counter = counterRef.current
    if (!counter || typeof window === "undefined") return

    // Create a proxy object for GSAP to animate
    const obj = { value: start }

    const updateCounter = () => {
      if (hasAnimated.current && triggerOnce) return

      hasAnimated.current = true

      // Kill any existing animation
      if (tweenRef.current) {
        tweenRef.current.kill()
      }

      // Create new tween
      tweenRef.current = gsap.to(obj, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          setValue(obj.value)
        },
      })
    }

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      onEnter: updateCounter,
      once: triggerOnce,
    })

    return () => {
      // Clean up
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
      trigger.kill()
    }
  }, [end, start, duration, triggerOnce])

  const formattedValue = value.toFixed(decimals)

  return (
    <span ref={counterRef} className={cn(className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
