/**
 * @file FormSection — grouped form fields with title and description.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn("space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <legend className="px-1 font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</legend>
      {description ? <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
