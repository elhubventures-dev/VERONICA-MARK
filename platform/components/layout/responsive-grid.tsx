/**
 * @file ResponsiveGrid — auto-fit grid that adapts tile width by minimum column size.
 * Perfect for product discovery rails with fluid breakpoints.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const minWidthVariants = {
  xs: "280px",
  sm: "320px",
  md: "360px",
  lg: "400px",
} as const;

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum column width before wrapping. */
  minColumnWidth?: keyof typeof minWidthVariants;
  /** Gap between items. */
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
} as const;

export function ResponsiveGrid({
  className,
  minColumnWidth = "sm",
  gap = "md",
  style,
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn("grid", gapClasses[gap], className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${minWidthVariants[minColumnWidth]}), 1fr))`,
        ...style,
      }}
      {...props}
    />
  );
}
