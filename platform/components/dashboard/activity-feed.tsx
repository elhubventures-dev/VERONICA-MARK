/**
 * @file ActivityFeed — chronological brand activity stream for admin dashboards.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: LucideIcon;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  className?: string;
}

export function ActivityFeed({ items, title = "Recent activity", className }: ActivityFeedProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)} aria-label={title}>
      <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
      <ol className="mt-4 space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={motionTransition(reduceMotion, 0.2 + index * 0.05)}
              className="flex gap-3"
            >
              {Icon ? (
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]" aria-hidden>
                  <Icon className="size-4" />
                </span>
              ) : (
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-foreground)]">{item.title}</p>
                {item.description ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p> : null}
                <time className="mt-1 block text-xs text-[var(--color-muted-foreground)]">{item.timestamp}</time>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
