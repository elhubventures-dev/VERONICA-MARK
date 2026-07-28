/**
 * @file WishlistButton — toggle control for saving fragrances to a wishlist.
 * Icon button with active state and accessible label.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface WishlistButtonProps {
  active?: boolean;
  onToggle?: () => void;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}

export function WishlistButton({
  className,
  active = false,
  onToggle,
  size = "md",
  disabled,
}: WishlistButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={onToggle}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.9 }}
      whileHover={reduceMotion || disabled ? undefined : { y: -1 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-[background-color,border-color,color,box-shadow] duration-300 hover:bg-[var(--color-muted)] hover:shadow-[var(--shadow-subtle)] disabled:pointer-events-none disabled:opacity-50",
        focusRingClass,
        active && "border-[var(--color-accent)] text-[var(--color-accent)]",
        size === "sm" ? "size-9" : "size-11",
        className,
      )}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={reduceMotion ? false : { scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={motionTransition(reduceMotion, 0.28)}
        className="inline-flex"
      >
        <Heart className={cn("size-4", active && "fill-current")} aria-hidden />
      </motion.span>
    </motion.button>
  );
}
