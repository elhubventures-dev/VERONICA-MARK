"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-deep)] text-white hover:bg-[color-mix(in_srgb,var(--color-brand-deep)_88%,black)]",
        secondary:
          "bg-[var(--color-secondary)] text-[var(--color-neutral)] hover:bg-[color-mix(in_srgb,var(--color-secondary)_90%,black)]",
        accent:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]",
        outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)]",
        ghost: "hover:bg-[var(--color-muted)]",
        destructive:
          "bg-[var(--color-error)] text-white hover:bg-[color-mix(in_srgb,var(--color-error)_90%,black)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
