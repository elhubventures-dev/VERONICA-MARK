/**
 * @file ChartContainer — responsive wrapper with title, legend slot, and token-based chart styling.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  height?: number;
}

export function ChartContainer({
  title,
  description,
  action,
  height = 280,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className,
      )}
      {...props}
    >
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      )}
      <div className="w-full" style={{ height }} aria-hidden={false}>
        {children}
      </div>
    </div>
  );
}

export const chartTheme = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  muted: "var(--color-muted-foreground)",
  grid: "var(--color-border)",
  surface: "var(--color-surface)",
} as const;
