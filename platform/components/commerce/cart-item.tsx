/**
 * @file CartItem — line item row for bag and mini-cart with image, details, and quantity.
 * Supports remove action and variant metadata display.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { Price } from "@/components/commerce/price";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  id: string;
  title: string;
  brand: string;
  variant?: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  quantity: number;
  /** Hard cap from live inventory. */
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  className?: string;
}

export function CartItem({
  title,
  brand,
  variant,
  imageSrc,
  imageAlt,
  price,
  quantity,
  maxQuantity,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  const stockCap = maxQuantity ?? 99;

  return (
    <article className={cn("flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4", className)}>
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted)]">
        <Image src={imageSrc} alt={imageAlt} fill sizes="96px" className="object-contain" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.1em] text-[var(--color-muted-foreground)] uppercase">
              {brand}
            </p>
            <h3 className="font-display text-base leading-snug">{title}</h3>
            {variant ? (
              <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{variant}</p>
            ) : null}
            {maxQuantity !== undefined ? (
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                {maxQuantity <= 0
                  ? "Out of stock"
                  : maxQuantity === 1
                    ? "1 left in stock"
                    : `${maxQuantity} left in stock`}
              </p>
            ) : null}
          </div>
          <Price amount={price * quantity} size="sm" />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          {onQuantityChange ? (
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={Math.max(1, stockCap)}
            />
          ) : (
            <span className="text-sm text-[var(--color-muted-foreground)]">Qty {quantity}</span>
          )}
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className={cn(
                "text-xs text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-error)] hover:underline",
                focusRingClass,
              )}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
