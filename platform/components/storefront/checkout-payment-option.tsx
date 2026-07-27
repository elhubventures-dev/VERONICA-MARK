"use client";

import { Lock } from "lucide-react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type CheckoutPaymentProvider = "paystack";

type CheckoutPaymentOptionProps = {
  provider: CheckoutPaymentProvider;
  selected: boolean;
  onSelect: () => void;
};

const copy: Record<CheckoutPaymentProvider, { name: string; description: string }> = {
  paystack: {
    name: "Paystack",
    description: "Cards, bank transfer and mobile money via a secure Paystack redirect (NGN).",
  },
};

export function CheckoutPaymentOption({
  provider,
  selected,
  onSelect,
}: CheckoutPaymentOptionProps) {
  const item = copy[provider];

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors",
        focusRingClass,
        selected
          ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]",
      )}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]">
        <Lock className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-sm font-medium">{item.name}</span>
        <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
          {item.description}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-1 size-4 shrink-0 rounded-full border-2",
          selected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
            : "border-[var(--color-border)]",
        )}
      />
    </button>
  );
}
