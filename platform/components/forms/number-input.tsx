/**
 * @file NumberInput — numeric input with increment and decrement controls.
 */

"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function NumberInput({ value, onChange, min = 0, max = 999, step = 1, label, className }: NumberInputProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))} className={cn("inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)]", focusRingClass)} aria-label="Decrease">
          <Minus className="size-4" aria-hidden />
        </button>
        <Input type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(clamp(Number(e.target.value)))} className="text-center" aria-label={label ?? "Quantity"} />
        <button type="button" onClick={() => onChange(clamp(value + step))} className={cn("inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)]", focusRingClass)} aria-label="Increase">
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
