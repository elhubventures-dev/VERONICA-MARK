/**
 * @file ActivityFeed — chronological activity stream (client).
 * Accepts rendered icon nodes — never Lucide component references from Server Components.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  /** Pre-rendered icon element (e.g. `<Bell className="size-4" />`), not a component reference. */
  icon?: ReactNode;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  className?: string;
}

export function ActivityFeed({ items, title = "Recent activity", className }: ActivityFeedProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className,
      )}
      aria-label={title}
    >
      <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
      <ol className="mt-4 space-y-4">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={motionTransition(reduceMotion, 0.2 + index * 0.05)}
            className="flex gap-3"
          >
            {item.icon ? (
              <span
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]"
                aria-hidden
              >
                {item.icon}
              </span>
            ) : (
              <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-foreground)]">{item.title}</p>
              {item.description ? (
                <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p>
              ) : null}
              <time className="mt-1 block text-xs text-[var(--color-muted-foreground)]">{item.timestamp}</time>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
