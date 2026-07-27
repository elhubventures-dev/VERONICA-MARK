/**
 * @file EmptyState — reusable empty data placeholder with optional action.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon, Inbox } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-12 text-center", className)}
    >
      <Icon className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button type="button" className="mt-6" onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </motion.div>
  );
}
