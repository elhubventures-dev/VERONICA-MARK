/**
 * @file PriceRangeFilter — dual-thumb price range slider for catalog filtering.
 */

"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface PriceRangeFilterProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: string;
  className?: string;
}

export function PriceRangeFilter({
  min = 0,
  max = 500,
  value,
  onChange,
  currency = "€",
  className,
}: PriceRangeFilterProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted-foreground)]">Price range</span>
        <span className="font-medium text-[var(--color-foreground)]">
          {currency}{value[0]} – {currency}{value[1]}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={5}
        value={value}
        onValueChange={(values: number[]) => onChange([values[0] ?? min, values[1] ?? max])}
        aria-label="Price range"
      />
    </div>
  );
}
