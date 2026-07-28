/**
 * @file PriceRangeFilter — dual-thumb price range slider for catalog filtering.
 * Bounds are the cheapest → most expensive catalog prices (NGN).
 * Display follows visitor region (NGN / USD).
 */

"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import { useRegion } from "@/features/storefront/region-context";
import { convertCatalogAmount, type StoreCurrency } from "@/lib/commerce/fx";
import { cn } from "@/lib/utils";

export interface PriceRangeFilterProps {
  /** Catalog (NGN) minimum bound — cheapest product. */
  min?: number;
  /** Catalog (NGN) maximum bound — most expensive product. */
  max?: number;
  /** Selected range in catalog NGN. */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

function rangeStep(min: number, max: number): number {
  const span = Math.max(0, max - min);
  if (span <= 0) return 1;
  if (span <= 1_000) return 50;
  if (span <= 50_000) return 500;
  if (span <= 500_000) return 1_000;
  return 5_000;
}

function clampRange(
  [low, high]: [number, number],
  min: number,
  max: number,
): [number, number] {
  const a = Math.min(Math.max(low, min), max);
  const b = Math.min(Math.max(high, min), max);
  return a <= b ? [a, b] : [b, a];
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
  const boundMin = Number.isFinite(min) ? min : 0;
  const boundMax = Number.isFinite(max) && max > boundMin ? max : boundMin + 1;
  const step = rangeStep(boundMin, boundMax);

  const [draft, setDraft] = React.useState<[number, number]>(() =>
    clampRange(value, boundMin, boundMax),
  );

  const valueMin = value[0];
  const valueMax = value[1];

  React.useEffect(() => {
    setDraft(clampRange([valueMin, valueMax], boundMin, boundMax));
  }, [valueMin, valueMax, boundMin, boundMax]);

  const label = (amountNgn: number) =>
    formatBound(convertCatalogAmount(amountNgn, displayCurrency, usdNgnRate), displayCurrency);

  return (
    <div className={cn("min-w-0 space-y-3 sm:space-y-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <span className="text-[var(--color-muted-foreground)]">Price range</span>
        <span className="min-w-0 font-medium text-[var(--color-foreground)] tabular-nums">
          {label(draft[0])} – {label(draft[1])}
        </span>
      </div>
      <Slider
        min={boundMin}
        max={boundMax}
        step={step}
        value={draft}
        onValueChange={(values: number[]) => {
          setDraft(clampRange([values[0] ?? boundMin, values[1] ?? boundMax], boundMin, boundMax));
        }}
        onValueCommit={(values: number[]) => {
          onChange(clampRange([values[0] ?? boundMin, values[1] ?? boundMax], boundMin, boundMax));
        }}
        aria-label="Price range"
        minStepsBetweenThumbs={1}
        className="w-full"
      />
    </div>
  );
}
