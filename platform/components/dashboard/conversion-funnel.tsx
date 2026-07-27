/**
 * @file ConversionFunnel — staged funnel visualization for checkout and browse flows.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FunnelStep {
  label: string;
  value: number;
  total?: number;
}

export interface ConversionFunnelProps {
  steps: FunnelStep[];
  title?: string;
  className?: string;
}

export function ConversionFunnel({ steps, title = "Conversion funnel", className }: ConversionFunnelProps) {
  const reduceMotion = useReducedMotion();
  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)} aria-label={title}>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="mt-6 space-y-4">
        {steps.map((step, index) => {
          const width = (step.value / maxValue) * 100;
          const rate = step.total ? Math.round((step.value / step.total) * 100) : undefined;
          return (
            <motion.li
              key={step.label}
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={motionTransition(reduceMotion, 0.25 + index * 0.05)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--color-foreground)]">{step.label}</span>
                <span className="text-[var(--color-muted-foreground)]">
                  {step.value.toLocaleString()}
                  {rate !== undefined ? ` (${rate}%)` : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: `${width}%` }}
                  role="progressbar"
                  aria-valuenow={step.value}
                  aria-valuemin={0}
                  aria-valuemax={maxValue}
                  aria-label={`${step.label}: ${step.value}`}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
