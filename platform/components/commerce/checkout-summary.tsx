/**
 * @file CheckoutSummary — sticky order recap for checkout with line items and totals.
 * Catalog line prices are NGN; Price converts for international browsers.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { CartSummary } from "@/components/commerce/cart-summary";
import { Price } from "@/components/commerce/price";
import { cn } from "@/lib/utils";

export interface CheckoutSummaryItem {
  id: string;
  title: string;
  variant?: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  quantity: number;
}

export interface CheckoutSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CheckoutSummaryItem[];
  subtotal: number;
  shipping?: number;
  shippingLabel?: string;
  shippingCurrency?: string;
  discount?: number;
  total: number;
  currency?: string;
  compact?: boolean;
}

export function CheckoutSummary({
  className,
  items,
  subtotal,
  shipping,
  shippingLabel,
  shippingCurrency,
  discount,
  total,
  compact = false,
  ...props
}: CheckoutSummaryProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h2 className="font-display text-xl">Order Summary</h2>

      {!compact ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted)]">
                <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                {item.variant ? (
                  <p className="text-xs text-[var(--color-muted-foreground)]">{item.variant}</p>
                ) : null}
                <p className="text-xs text-[var(--color-muted-foreground)]">Qty {item.quantity}</p>
              </div>
              <Price amount={item.price * item.quantity} size="sm" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {items.length} item{items.length === 1 ? "" : "s"} in your order
        </p>
      )}

      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        shippingLabel={shippingLabel}
        shippingCurrency={shippingCurrency}
        discount={discount}
        total={total}
        pricesIncludeTax
      />
    </div>
  );
}
