/**
 * @file StatWidget — compact inline statistic for dashboard summaries.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface StatWidgetProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function StatWidget({ label, value, hint, className }: StatWidgetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion, 0.25)}
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3",
        className,
      )}
    >
      <p className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-[var(--color-foreground)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{hint}</p> : null}
    </motion.div>
  );
}
