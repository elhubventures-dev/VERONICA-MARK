import * as React from "react";

/**
 * VERONICA MARK Skeleton.
 *
 * Purpose: Loading placeholder mirroring content layout.
 * A11y: aria-busy on parent; use aria-hidden on skeleton elements.
 * Usage: `<Skeleton className="h-4 w-[200px]" />`.
 */
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--color-muted)]",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
