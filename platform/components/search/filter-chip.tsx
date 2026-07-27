/**
 * @file FilterChip — removable active filter pill.
 */

"use client";

import { X } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 text-sm text-[var(--color-foreground)]",
        className,
      )}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className={cn("rounded-lg p-0.5 hover:bg-[var(--color-surface)]", focusRingClass)}
          aria-label={`Remove filter ${label}`}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
