"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { JSX } from "react";

type AnimationType =
  | "fadeIn"
  | "slideUp"
  | "slideRight"
  | "slideLeft"
  | "scale";

interface AnimatedTextProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  animation?: AnimationType;
  delay?: number;
}

export function AnimatedText({
  text,
  tag = "h1",
  className,
  animation = "fadeIn",
  delay = 0,
}: AnimatedTextProps) {
  const Tag = tag as any;

  // Animation variants
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.8,
          delay,
        },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay,
        },
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          delay,
        },
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          delay,
        },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.8,
          delay,
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={animations[animation]}
    >
      <Tag className={cn(className)}>{text}</Tag>
    </motion.div>
  );
}
