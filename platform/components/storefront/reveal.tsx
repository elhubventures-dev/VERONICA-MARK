"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay before the reveal starts (seconds). */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  /** Fraction of element that must be visible to trigger. */
  amount?: number | "some" | "all";
};

/**
 * Scroll-triggered fade-up. Content stays in the DOM for SSR/SEO;
 * motion is a visual layer only. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  amount = 0.35,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        ...motionTransition(reduceMotion, 0.5),
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
