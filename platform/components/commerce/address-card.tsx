/**
 * @file AddressCard — selectable delivery or billing address for checkout and account.
 * Displays formatted address with default badge and edit action.
 */

"use client";

import { MapPin, Pencil } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AddressCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  lines: string[];
  selected?: boolean;
  isDefault?: boolean;
  onEdit?: () => void;
}

export function AddressCard({
  className,
  name,
  lines,
  selected = false,
  isDefault = false,
  onEdit,
  ...props
}: AddressCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        selected
          ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
        className,
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        className={cn("flex w-full items-start gap-3 text-left", focusRingClass)}
        {...props}
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-accent)]">
          <MapPin className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{name}</span>
            {isDefault ? (
              <span className="rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[10px] tracking-wide uppercase">
                Default
              </span>
            ) : null}
          </span>
          <span className="mt-1 block space-y-0.5 text-sm text-[var(--color-muted-foreground)]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
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

      {onEdit ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label={`Edit address for ${name}`}
          className={cn(
            "absolute top-4 right-4 rounded-lg p-2 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
            focusRingClass,
          )}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
