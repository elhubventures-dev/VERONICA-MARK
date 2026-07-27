/**
 * @file ProgressRing — circular progress indicator for goals and completion metrics.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  label,
  className,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference - percent * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={Math.round(percent * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${Math.round(percent * 100)}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={motionTransition(reduceMotion, 0.6)}
        />
      </svg>
      <span className="absolute font-display text-lg font-semibold text-[var(--color-foreground)]">
        {Math.round(percent * 100)}%
      </span>
    </div>
  );
}
