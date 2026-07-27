/**
 * @file Stack — vertical and horizontal flex layout primitive with consistent spacing tokens.
 * Use for form groups, card internals, and navigation clusters.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const gapVariants = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
} as const;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction. */
  direction?: "vertical" | "horizontal";
  /** Spacing between children. */
  gap?: keyof typeof gapVariants;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Allow children to wrap on small screens. */
  wrap?: boolean;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export function Stack({
  className,
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapVariants[gap],
        alignMap[align],
        justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}
