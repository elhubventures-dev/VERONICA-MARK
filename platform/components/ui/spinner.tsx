/**
 * VERONICA MARK Spinner.
 *
 * Purpose: Indeterminate loading indicator with reduced-motion support.
 * A11y: role=status with aria-label; respects prefers-reduced-motion.
 * Usage: `<Spinner aria-label="Loading" />`.
 */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"div"> {
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "size-4",
  default: "size-6",
  lg: "size-8",
} as const;

function Spinner({
  className,
  size = "default",
  "aria-label": ariaLabel = "Loading",
  ...props
}: SpinnerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <motion.span
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? undefined
            : { repeat: Infinity, duration: 1, ease: "linear" }
        }
        className="inline-flex"
      >
        <Loader2
          className={cn(
            sizeClasses[size],
            "text-[var(--color-primary)]",
            shouldReduceMotion && "animate-none opacity-70",
          )}
          aria-hidden="true"
        />
      </motion.span>
    </div>
  );
}

export { Spinner };
