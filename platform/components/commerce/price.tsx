/**
 * @file Price — formatted currency display with optional compare-at and sale styling.
 * Catalog amounts are NGN (tax-inclusive). Outside Nigeria, amounts convert to USD at ₦1,500/$1
 * when `currency` is omitted (region-driven). Explicit `currency` means the amount is already
 * in that currency (no conversion) — used for shipping fees.
 */

"use client";

import * as React from "react";

import { useRegion } from "@/features/storefront/region-context";
import { convertCatalogAmount, type StoreCurrency } from "@/lib/commerce/fx";
import { formatPrice } from "@/lib/commerce/format-price";
import { TAX_INCLUSIVE_PRICE_HINT } from "@/lib/commerce/tax";
import { cn } from "@/lib/utils";

export interface PriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Amount in major units (catalog NGN unless `currency` is set explicitly). */
  amount: number;
  /**
   * When set, amount is treated as already in this currency (no FX).
   * When omitted, amount is catalog NGN and converts to the visitor display currency.
   */
  currency?: StoreCurrency | string;
  /** Original price for sale comparison (same units as `amount`). */
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  from?: boolean;
  taxInclusive?: boolean;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base font-medium",
  lg: "text-xl font-medium",
} as const;

export function Price({
  className,
  amount,
  currency,
  compareAt,
  size = "md",
  from = false,
  taxInclusive,
  ...props
}: PriceProps) {
  const { displayCurrency, usdNgnRate } = useRegion();

  const explicit = currency !== undefined;
  const display = (explicit ? currency : displayCurrency) as string;
  const resolvedAmount = explicit
    ? amount
    : convertCatalogAmount(amount, displayCurrency as StoreCurrency, usdNgnRate);
  const resolvedCompare =
    compareAt === undefined
      ? undefined
      : explicit
        ? compareAt
        : convertCatalogAmount(compareAt, displayCurrency as StoreCurrency, usdNgnRate);

  const onSale = resolvedCompare !== undefined && resolvedCompare > resolvedAmount;
  const showTaxHint = taxInclusive ?? true;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)} {...props}>
      {from ? (
        <span className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">From</span>
      ) : null}
      <span
        className={cn(
          sizeClasses[size],
          onSale ? "text-[var(--color-error)]" : "text-[var(--color-foreground)]",
        )}
      >
        {formatPrice(resolvedAmount, display)}
      </span>
      {onSale && resolvedCompare !== undefined ? (
        <span className="text-sm text-[var(--color-muted-foreground)] line-through">
          {formatPrice(resolvedCompare, display)}
        </span>
      ) : null}
      {showTaxHint ? (
        <span className="text-[0.65rem] tracking-wide text-[var(--color-muted-foreground)] lowercase">
          {TAX_INCLUSIVE_PRICE_HINT}
        </span>
      ) : null}
    </span>
  );
}

export { formatPrice };
