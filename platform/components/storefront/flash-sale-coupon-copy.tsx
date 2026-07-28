"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { focusRingClass } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { cn } from "@/lib/utils";

type FlashSaleCouponCopyProps = {
  /** Visual treatment for dark hero panels vs light campaign cards. */
  variant?: "dark" | "light";
  className?: string;
  /** Optional override; defaults to the canonical opening coupon. */
  code?: string;
};

export function FlashSaleCouponCopy({
  variant = "dark",
  className,
  code = flashSale.couponCode ?? "VM5AUG-20",
}: FlashSaleCouponCopyProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Promo code copied", {
        description: `Paste ${code} at checkout for ${flashSale.discountPercent ?? 20}% off.`,
      });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy code", {
        description: `Please enter ${code} manually at checkout.`,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied promo code ${code}` : `Copy promo code ${code}`}
      className={cn(
        "group inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]",
        focusRingClass,
        variant === "dark"
          ? "border-white/15 bg-white/5 text-white hover:border-[var(--color-accent)]/55 hover:bg-white/10"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-muted)]",
        className,
      )}
    >
      <span className="min-w-0">
        <span
          className={cn(
            "block text-[0.65rem] font-semibold tracking-[0.2em] uppercase",
            variant === "dark" ? "text-[var(--color-accent)]" : "text-primary",
          )}
        >
          {copied ? "Copied" : "Tap to copy"}
        </span>
        <span className="mt-1 block truncate font-display text-2xl tracking-wide">{code}</span>
      </span>
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
          variant === "dark"
            ? "border-white/15 bg-white/8 text-[var(--color-accent)]"
            : "border-[var(--color-border)] bg-[var(--color-muted)] text-primary",
        )}
      >
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </span>
    </button>
  );
}
