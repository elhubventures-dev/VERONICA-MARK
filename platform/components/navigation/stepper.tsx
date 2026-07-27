/**
 * @file Stepper — multi-step progress indicator for checkout and onboarding flows.
 * Supports horizontal and vertical orientations with accessible step states.
 */

"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type StepStatus = "complete" | "current" | "upcoming";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
}

export interface StepperProps extends React.HTMLAttributes<HTMLElement> {
  steps: StepperStep[];
  orientation?: "horizontal" | "vertical";
}

export function Stepper({
  className,
  steps,
  orientation = "horizontal",
  ...props
}: StepperProps) {
  return (
    <nav
      aria-label="Progress"
      className={cn(
        orientation === "horizontal" ? "w-full" : "flex flex-col",
        className,
      )}
      {...props}
    >
      <ol
        className={cn(
          orientation === "horizontal"
            ? "flex items-start justify-between gap-2"
            : "space-y-4",
        )}
      >
        {steps.map((step, index) => {
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";

          return (
            <li
              key={step.id}
              className={cn(
                "flex",
                orientation === "horizontal" ? "min-w-0 flex-1 flex-col items-center text-center" : "gap-3",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className={cn("flex items-center", orientation === "horizontal" && "w-full")}>
                {orientation === "horizontal" && index > 0 ? (
                  <div
                    aria-hidden
                    className={cn(
                      "mx-2 h-px flex-1",
                      isComplete || isCurrent
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-border)]",
                    )}
                  />
                ) : null}

                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                    isComplete && "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-neutral)]",
                    isCurrent &&
                      "border-[var(--color-primary)] bg-[var(--color-primary)] text-white",
                    step.status === "upcoming" &&
                      "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]",
                  )}
                >
                  {isComplete ? <Check className="size-4" aria-hidden /> : index + 1}
                </span>

                {orientation === "horizontal" && index < steps.length - 1 ? (
                  <div
                    aria-hidden
                    className={cn(
                      "mx-2 h-px flex-1",
                      isComplete ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]",
                    )}
                  />
                ) : null}
              </div>

              <div className={cn(orientation === "horizontal" ? "mt-2 px-1" : "min-w-0")}>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]",
                  )}
                >
                  {step.label}
                </p>
                {step.description ? (
                  <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
