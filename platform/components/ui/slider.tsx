/**
 * VERONICA MARK Slider (Radix).
 *
 * Purpose: Select a numeric value from a continuous or stepped range.
 * A11y: Arrow keys adjust value; thumb has 44px touch target.
 * Usage: `<Slider defaultValue={[50]} max={100} step={1} />`.
 */
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none items-center select-none",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-muted)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--color-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)] shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 before:absolute before:-inset-3 before:content-['']" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
