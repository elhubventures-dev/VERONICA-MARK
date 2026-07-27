/**
 * VERONICA MARK Toggle (Radix).
 *
 * Purpose: Pressable control that maintains on/off pressed state.
 * A11y: aria-pressed state; 44px minimum touch target.
 * Usage: `<Toggle aria-label="Bold"><Bold /></Toggle>`.
 */
"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--color-muted)] data-[state=on]:text-[var(--color-foreground)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] data-[state=on]:border-[var(--color-primary)]",
      },
      size: {
        default: "h-11 px-3",
        sm: "h-9 min-h-9 min-w-9 px-2",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
