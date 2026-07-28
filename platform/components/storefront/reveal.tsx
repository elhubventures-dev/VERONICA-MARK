"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionTransition, revealVariants } from "@/lib/motion";
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
  /** Direction/preset for the reveal. */
  variant?: keyof typeof revealVariants;
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
  variant = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const variants = revealVariants[variant](y);

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{
        ...motionTransition(reduceMotion, 0.5),
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
