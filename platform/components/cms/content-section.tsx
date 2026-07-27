/**
 * @file ContentSection — titled CMS section with optional actions.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ContentSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ title, description, action, children, className }: ContentSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={motionTransition(reduceMotion)}
      className={cn("space-y-6", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--color-foreground)]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
