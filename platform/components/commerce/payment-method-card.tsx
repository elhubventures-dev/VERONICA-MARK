/**
 * @file PaymentMethodCard — selectable saved payment method for checkout.
 * Supports card brands with default indicator and selection state.
 */

"use client";

import { CreditCard } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PaymentMethodCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  brand: string;
  last4: string;
  expiry: string;
  selected?: boolean;
  isDefault?: boolean;
}

export function PaymentMethodCard({
  className,
  brand,
  last4,
  expiry,
  selected = false,
  isDefault = false,
  ...props
}: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors",
        focusRingClass,
        selected
          ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]",
        className,
      )}
      {...props}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]">
        <CreditCard className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{brand}</span>
          {isDefault ? (
            <span className="rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[10px] tracking-wide uppercase">
              Default
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
          •••• {last4} · Exp {expiry}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-1 size-4 shrink-0 rounded-full border-2",
          selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]",
        )}
      />
    </button>
  );
}
