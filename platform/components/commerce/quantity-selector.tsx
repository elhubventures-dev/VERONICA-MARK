/**
 * @file QuantitySelector — increment/decrement control for cart and PDP quantities.
 * Enforces min/max bounds with accessible stepper buttons.
 */

"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
  label = "Quantity",
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const buttonClass = cn(
    "inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-muted)] disabled:opacity-40",
    focusRingClass,
  );

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="sr-only">{label}</span>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={decrement}
        disabled={disabled || value <= min}
        className={buttonClass}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span
        aria-live="polite"
        className="min-w-10 text-center text-sm font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={increment}
        disabled={disabled || value >= max}
        className={buttonClass}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
