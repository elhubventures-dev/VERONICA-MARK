/**
 * @file DashboardHeader — page header with title, subtitle, and action slot for brand admin.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, subtitle, actions, className }: DashboardHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between", className)}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </motion.header>
  );
}
