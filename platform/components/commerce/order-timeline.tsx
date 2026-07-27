/**
 * @file OrderTimeline — vertical fulfillment timeline for order tracking pages.
 * Shows timestamped milestones with complete/current/upcoming states.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type TimelineEventStatus = "complete" | "current" | "upcoming";

export interface OrderTimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status: TimelineEventStatus;
}

export interface OrderTimelineProps extends React.HTMLAttributes<HTMLElement> {
  events: OrderTimelineEvent[];
}

export function OrderTimeline({ className, events, ...props }: OrderTimelineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ol className={cn("space-y-0", className)} {...props}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isComplete = event.status === "complete";
        const isCurrent = event.status === "current";

        return (
          <motion.li
            key={event.id}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={motionTransition(reduceMotion, 0.25)}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-8 left-[15px] h-[calc(100%-2rem)] w-px",
                  isComplete ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]",
                )}
              />
            ) : null}

            <span
              className={cn(
                "relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border",
                isComplete && "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-neutral)]",
                isCurrent && "border-[var(--color-primary)] bg-[var(--color-primary)] text-white",
                event.status === "upcoming" &&
                  "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]",
              )}
            >
              {isComplete ? <Check className="size-4" aria-hidden /> : <Circle className="size-3" aria-hidden />}
            </span>

            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-[var(--color-foreground)]">{event.title}</p>
              {event.description ? (
                <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{event.description}</p>
              ) : null}
              {event.timestamp ? (
                <time className="mt-1 block text-xs text-[var(--color-muted-foreground)]">
                  {event.timestamp}
                </time>
              ) : null}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
