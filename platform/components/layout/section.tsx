/**
 * @file Section — semantic page section with optional background, spacing, and divider treatments.
 * Wraps catalog rails, editorial features, and checkout panels.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const spacingVariants = {
  none: "py-0",
  sm: "py-8 md:py-10",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
} as const;

const toneVariants = {
  default: "bg-transparent",
  surface: "bg-[var(--color-surface)]",
  muted: "bg-[var(--color-muted)]",
  primary: "bg-[var(--color-brand-deep)] text-white",
} as const;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding preset. */
  spacing?: keyof typeof spacingVariants;
  /** Background tone. */
  tone?: keyof typeof toneVariants;
  /** Render a subtle top border divider. */
  divider?: boolean;
  /** Animate section on enter (respects reduced motion). */
  animate?: boolean;
}

export function Section({
  className,
  spacing = "md",
  tone = "default",
  divider = false,
  animate = false,
  children,
  ...props
}: SectionProps) {
  const reduceMotion = useReducedMotion();

  const content = (
    <section
      className={cn(
        spacingVariants[spacing],
        toneVariants[tone],
        divider && "border-t border-[var(--color-border)]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={motionTransition(reduceMotion)}
    >
      {content}
    </motion.div>
  );
}
