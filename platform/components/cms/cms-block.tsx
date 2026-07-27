/**
 * @file CmsBlock — generic wrapper for editable CMS content blocks.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CmsBlockProps {
  id?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function CmsBlock({ id, label, children, className }: CmsBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={motionTransition(reduceMotion)}
      className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}
      aria-label={label}
    >
      {label ? <p className="mb-4 text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{label}</p> : null}
      {children}
    </motion.section>
  );
}
