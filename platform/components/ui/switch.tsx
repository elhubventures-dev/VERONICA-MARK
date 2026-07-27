/**
 * VERONICA MARK Switch (Radix).
 *
 * Purpose: Toggle between on/off states.
 * A11y: 44px touch target wrapper; role=switch with keyboard activation.
 * Usage: `<Switch checked={on} onCheckedChange={setOn} aria-label="Notifications" />`.
 */
"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-[var(--color-surface)] shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[22px]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
