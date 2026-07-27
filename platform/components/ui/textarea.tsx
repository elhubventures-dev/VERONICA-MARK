/**
 * VERONICA MARK Textarea.
 *
 * Purpose: Multi-line text input matching Input styling.
 * A11y: Native textarea with focus-visible accent ring; pair with Label.
 * Usage: `<Textarea placeholder="Message" rows={4} />`.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[88px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-foreground)] shadow-sm transition-colors placeholder:text-[var(--color-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
