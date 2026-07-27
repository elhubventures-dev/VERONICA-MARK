import * as React from "react";

/**
 * VERONICA MARK Kbd.
 *
 * Purpose: Display keyboard shortcut hints inline with UI copy.
 * A11y: Decorative; ensure surrounding text explains the shortcut action.
 * Usage: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`.
 */
import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
