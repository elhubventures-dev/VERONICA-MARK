/**
 * @file Fieldset — accessible grouped form controls with legend.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FieldsetProps {
  legend: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Fieldset({ legend, description, children, disabled, className }: FieldsetProps) {
  return (
    <fieldset disabled={disabled} className={cn("space-y-4 rounded-xl border border-[var(--color-border)] p-6", disabled && "opacity-60", className)}>
      <legend className="px-1 text-sm font-semibold text-[var(--color-foreground)]">{legend}</legend>
      {description ? <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      {children}
    </fieldset>
  );
}
