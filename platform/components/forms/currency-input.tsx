/**
 * @file CurrencyInput — EUR-formatted currency entry for pricing forms.
 */

"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  className?: string;
}

export function CurrencyInput({ label, value = 0, onChange, currency = "₦", className }: CurrencyInputProps) {
  const [display, setDisplay] = React.useState(String(value));

  React.useEffect(() => {
    setDisplay(value ? String(value) : "");
  }, [value]);

  const parse = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label>{label}</Label> : null}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--color-muted-foreground)]">{currency}</span>
        <Input
          inputMode="decimal"
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
            onChange?.(parse(e.target.value));
          }}
          className="pl-8"
          aria-label={label ?? "Amount"}
        />
      </div>
    </div>
  );
}
