import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-primary)] text-white",
        secondary: "border-transparent bg-[var(--color-secondary)] text-[var(--color-neutral)]",
        accent: "border-transparent bg-[var(--color-accent)] text-[var(--color-neutral)]",
        outline: "border-[var(--color-border)] text-[var(--color-foreground)]",
        success: "border-transparent bg-[var(--color-success)] text-white",
        warning: "border-transparent bg-[var(--color-warning)] text-[var(--color-neutral)]",
        error: "border-transparent bg-[var(--color-error)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
