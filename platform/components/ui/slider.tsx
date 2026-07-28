/**
 * VERONICA MARK Slider (Radix).
 *
 * Purpose: Select a numeric value from a continuous or stepped range.
 * Supports single- and dual-thumb (range) modes based on `value` / `defaultValue` length.
 * A11y: Arrow keys adjust value; each thumb has a 44px touch target.
 * Usage: `<Slider defaultValue={[50]} max={100} step={1} />` or
 *         `<Slider defaultValue={[25, 75]} max={100} step={1} />`.
 */
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const thumbClassName =
  "relative block size-5 shrink-0 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)] shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 before:absolute before:-inset-3 before:content-['']";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  const thumbCount = Math.max(
    Array.isArray(value) ? value.length : 0,
    Array.isArray(defaultValue) ? defaultValue.length : 0,
    1,
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex w-full touch-none items-center select-none py-2",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-muted)]">
        <SliderPrimitive.Range className="absolute h-full bg-[var(--color-primary)]" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderPrimitive.Thumb key={index} className={thumbClassName} />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
