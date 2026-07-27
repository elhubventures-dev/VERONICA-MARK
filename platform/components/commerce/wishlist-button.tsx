/**
 * @file WishlistButton — toggle control for saving fragrances to a wishlist.
 * Icon button with active state and accessible label.
 */

"use client";

import { Heart } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface WishlistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onToggle?: () => void;
  size?: "sm" | "md";
}

export function WishlistButton({
  className,
  active = false,
  onToggle,
  size = "md",
  ...props
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-muted)]",
        focusRingClass,
        active && "border-[var(--color-accent)] text-[var(--color-accent)]",
        size === "sm" ? "size-9" : "size-11",
        className,
      )}
      {...props}
    >
      <Heart className={cn("size-4", active && "fill-current")} aria-hidden />
    </button>
  );
}
