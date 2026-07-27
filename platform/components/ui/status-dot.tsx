/**
 * VERONICA MARK StatusDot.
 *
 * Purpose: Compact status indicator for online, busy, or error states.
 * A11y: Pair with visible text label; use aria-label when standalone.
 * Usage: `<StatusDot status="success" aria-label="Online" />`.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusDotVariants = cva("inline-block size-2.5 shrink-0 rounded-full", {
  variants: {
    status: {
      default: "bg-[var(--color-muted-foreground)]",
      success: "bg-[var(--color-success)]",
      warning: "bg-[var(--color-warning)]",
      error: "bg-[var(--color-error)]",
      info: "bg-[var(--color-info)]",
      primary: "bg-[var(--color-primary)]",
      accent: "bg-[var(--color-accent)]",
    },
    pulse: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    status: "default",
    pulse: false,
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {}

function StatusDot({ className, status, pulse, ...props }: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ status, pulse }), className)}
      role="img"
      {...props}
    />
  );
}

export { StatusDot, statusDotVariants };
