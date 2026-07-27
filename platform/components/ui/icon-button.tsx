/**
 * VERONICA MARK IconButton.
 *
 * Purpose: Square icon-only control with 44px minimum touch target.
 * A11y: Requires aria-label; focus-visible ring uses accent token.
 * Usage: `<IconButton aria-label="Close"><X /></IconButton>`.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export type IconButtonProps = ButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "icon", ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("min-h-11 min-w-11 shrink-0", className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";

export { IconButton };
