/**
 * @file Grid — CSS grid layout primitive with responsive column presets.
 * Ideal for product tiles, editorial modules, and dashboard panels.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const columnVariants = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-12",
} as const;

const gapVariants = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at largest breakpoint. */
  columns?: keyof typeof columnVariants;
  /** Gap between grid items. */
  gap?: keyof typeof gapVariants;
}

export function Grid({ className, columns = 3, gap = "md", ...props }: GridProps) {
  return (
    <div className={cn("grid", columnVariants[columns], gapVariants[gap], className)} {...props} />
  );
}
