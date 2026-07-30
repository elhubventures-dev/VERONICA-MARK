/**
 * @file CouponInput — promotional code entry with apply/remove states and validation feedback.
 * Used in bag and checkout summary panels.
 */

"use client";

import { Check, Tag, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface CouponInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onApply?: (code: string) => void | Promise<void>;
  onRemove?: () => void;
  appliedCode?: string;
  loading?: boolean;
  error?: string;
  successMessage?: string;
  className?: string;
}

export function CouponInput({
  value: valueProp,
  onChange,
  onApply,
  onRemove,
  appliedCode,
  loading = false,
  error,
  successMessage,
  className,
}: CouponInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const value = valueProp ?? internalValue;

  const setValue = (next: string) => {
    setInternalValue(next);
    onChange?.(next);
  };

  const handleApply = async () => {
    if (!value.trim()) return;
    await onApply?.(value.trim().toUpperCase());
  };

  if (appliedCode) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_8%,var(--color-surface))] px-4 py-3",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          <Check className="size-4 text-[var(--color-success)]" aria-hidden />
          <span>
            Code <strong>{appliedCode}</strong> applied
          </span>
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove promo code"
            className="rounded-lg p-1 hover:bg-[var(--color-muted)]"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
        {successMessage ? (
          <p className="sr-only">{successMessage}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="coupon-code" className="flex items-center gap-2">
        <Tag className="size-4 text-[var(--color-accent)]" aria-hidden />
        Promo code
      </Label>
      <div className="flex gap-2">
        <Input
          id="coupon-code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="VMA5AUG"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-error" : undefined}
        />
        <Button type="button" variant="outline" onClick={handleApply} disabled={loading || !value.trim()}>
          {loading ? "Applying…" : "Apply"}
        </Button>
      </div>
      {error ? (
        <p id="coupon-error" className="text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
