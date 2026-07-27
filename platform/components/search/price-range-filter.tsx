/**
 * @file PriceRangeFilter — dual-thumb price range slider for catalog filtering.
 * Catalog amounts are NGN; display follows visitor region (NGN / USD).
 */

"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import { useRegion } from "@/features/storefront/region-context";
import { convertCatalogAmount, type StoreCurrency } from "@/lib/commerce/fx";
import { cn } from "@/lib/utils";

export interface PriceRangeFilterProps {
  /** Catalog (NGN) minimum bound. */
  min?: number;
  /** Catalog (NGN) maximum bound. */
  max?: number;
  /** Selected range in catalog NGN. */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

function rangeStep(min: number, max: number): number {
  const span = Math.max(0, max - min);
  if (span <= 1_000) return 50;
  if (span <= 50_000) return 500;
  if (span <= 500_000) return 1_000;
  return 5_000;
}

function formatBound(amount: number, currency: StoreCurrency): string {
  const locale = currency === "NGN" ? "en-NG" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
}

export function PriceRangeFilter({
  min = 0,
  max = 500_000,
  value,
  onChange,
  className,
}: PriceRangeFilterProps) {
  const { displayCurrency, usdNgnRate } = useRegion();
  const step = rangeStep(min, max);

  const label = (amountNgn: number) =>
    formatBound(convertCatalogAmount(amountNgn, displayCurrency, usdNgnRate), displayCurrency);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-[var(--color-muted-foreground)]">Price range</span>
        <span className="font-medium text-[var(--color-foreground)] tabular-nums">
          {label(value[0])} – {label(value[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(values: number[]) => onChange([values[0] ?? min, values[1] ?? max])}
        aria-label="Price range"
      />
    </div>
  );
}
