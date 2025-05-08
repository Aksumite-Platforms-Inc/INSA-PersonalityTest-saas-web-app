"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  triggerOnce?: boolean;
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
  const [value, setValue] = useState(start);
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, { once: triggerOnce, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || (hasAnimated.current && triggerOnce)) return;

    hasAnimated.current = true;

    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setValue(start + Math.floor(progress * (end - start)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, start, duration, triggerOnce]);

  const formattedValue = value.toFixed(decimals);

  return (
    <span ref={counterRef} className={cn(className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
