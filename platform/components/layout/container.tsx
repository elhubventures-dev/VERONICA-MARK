/**
 * @file Container — max-width content wrapper aligned to VERONICA MARK layout grid.
 * Centers page content with responsive horizontal padding and optional narrow/wide variants.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const widthVariants = {
  default: "max-w-[var(--content-max,1440px)]",
  narrow: "max-w-3xl",
  wide: "max-w-[1600px]",
  full: "max-w-none",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width preset for editorial vs catalog layouts. */
  width?: keyof typeof widthVariants;
  /** Remove horizontal padding for edge-to-edge media. */
  flush?: boolean;
}

export function Container({
  className,
  width = "default",
  flush = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        widthVariants[width],
        !flush && "px-6 md:px-10 lg:px-16",
        className,
      )}
      {...props}
    />
  );
}
