"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  animated = false,
  showText = true,
  className,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-3xl",
  };

  const LogoIcon = animated ? motion.svg : "svg";
  const animationProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon
        className={cn("text-primary", sizeClasses[size])}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...animationProps}
      >
        {/* Shield Base */}
        <path
          d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Ethiopian Star Pattern */}
        <path
          d="M50 15L55 25H65L57.5 32L60 42L50 37L40 42L42.5 32L35 25H45L50 15Z"
          fill="currentColor"
          fillOpacity="0.2"
        />

        {/* Brain Outline */}
        <path
          d="M35 40C30 45 30 55 35 60C40 65 45 65 50 60C55 65 60 65 65 60C70 55 70 45 65 40C60 35 55 35 50 40C45 35 40 35 35 40Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Brain Connections */}
        <path
          d="M50 40V60M40 45L45 55M60 45L55 55M35 50H65"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Animated Pulse (only visible when animated) */}
        {animated && (
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.5"
            fill="none"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </LogoIcon>

      {showText && (
        <div className={cn("font-bold tracking-tight", textSizeClasses[size])}>
          <span className="text-primary">አዕምሮ</span>
          <span className="text-muted-foreground ml-1">Shield</span>
        </div>
      )}
    </div>
  );
}
