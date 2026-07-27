/**
 * VERONICA MARK ButtonGroup.
 *
 * Purpose: Group related actions with shared borders and spacing.
 * A11y: Uses role="group" with aria-label; child buttons retain individual focus rings.
 * Usage: `<ButtonGroup aria-label="Actions"><Button>Save</Button></ButtonGroup>`.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "horizontal", role = "group", ...props }, ref) => (
  <div
    ref={ref}
    role={role}
    className={cn(
      "inline-flex",
      orientation === "horizontal"
        ? "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0"
        : "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0",
      className,
    )}
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
