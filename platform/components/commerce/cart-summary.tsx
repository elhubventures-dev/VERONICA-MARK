/**
 * @file CartSummary — subtotal, shipping, tax, and total breakdown for bag/checkout.
 * Catalog amounts are NGN; Price converts to USD for international browsers.
 */

"use client";

import * as React from "react";

import { Price } from "@/components/commerce/price";
import { TAX_INCLUSIVE_SUMMARY_NOTE } from "@/lib/commerce/tax";
import { cn } from "@/lib/utils";

export interface CartSummaryLine {
  label: string;
  amount: number;
  emphasis?: boolean;
}

export interface CartSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Subtotal in catalog NGN. */
  subtotal: number;
  shipping?: number;
  shippingLabel?: string;
  /** When `USD`, shipping amount is already dollars (no FX). Otherwise treated as NGN. */
  shippingCurrency?: string;
  tax?: number;
  discount?: number;
  discountLabel?: string;
  /** Grand total in catalog NGN (Paystack charge basis). */
  total: number;
  /** @deprecated Region drives display currency; kept for API compat. */
  currency?: string;
  pricesIncludeTax?: boolean;
  extraLines?: CartSummaryLine[];
}

function SummaryRow({
  label,
  amount,
  /** When set, amount is already in this currency. */
  forceCurrency,
  emphasis = false,
}: {
  label: string;
  amount: number;
  forceCurrency?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={emphasis ? "font-medium text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}>
        {label}
      </span>
      <Price
        amount={amount}
        {...(forceCurrency ? { currency: forceCurrency } : {})}
        size="sm"
        taxInclusive={false}
      />
    </div>
  );
}

export function CartSummary({
  className,
  subtotal,
  shipping,
  shippingLabel = "Shipping",
  shippingCurrency,
  tax,
  discount,
  discountLabel = "Discount",
  total,
  pricesIncludeTax = true,
  extraLines,
  ...props
}: CartSummaryProps) {
  const shippingForce = shippingCurrency === "USD" ? "USD" : undefined;

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        className,
      )}
      {...props}
    >
      <SummaryRow label="Subtotal" amount={subtotal} />
      {discount !== undefined && discount > 0 ? (
        <SummaryRow label={discountLabel} amount={-discount} />
      ) : null}
      {shipping !== undefined ? (
        <SummaryRow label={shippingLabel} amount={shipping} forceCurrency={shippingForce} />
      ) : null}
      {tax !== undefined && tax > 0 ? <SummaryRow label="Tax" amount={tax} /> : null}
      {extraLines?.map((line) => (
        <SummaryRow
          key={line.label}
          label={line.label}
          amount={line.amount}
          emphasis={line.emphasis}
        />
      ))}
      <div className="border-t border-[var(--color-border)] pt-3">
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-lg">Total</span>
          <Price amount={total} size="lg" taxInclusive={false} />
        </div>
        {pricesIncludeTax ? (
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">{TAX_INCLUSIVE_SUMMARY_NOTE}</p>
        ) : null}
      </div>
    </div>
  );
}
