/**
 * @file VariantSelector — size/concentration variant picker for fragrance PDP.
 * Renders pill-style options with sold-out and selected states.
 */

"use client";

import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProductVariant {
  id: string;
  label: string;
  available?: boolean;
}

export interface VariantSelectorProps {
  label?: string;
  variants: ProductVariant[];
  value?: string;
  onChange?: (variantId: string) => void;
  className?: string;
}

export function VariantSelector({
  label = "Size",
  variants,
  value,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-[var(--color-foreground)]">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {variants.map((variant) => {
          const selected = value === variant.id;
          const unavailable = variant.available === false;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={unavailable}
              onClick={() => onChange?.(variant.id)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm transition-colors",
                focusRingClass,
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]",
                unavailable && "cursor-not-allowed opacity-40 line-through",
              )}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
