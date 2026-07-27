/**
 * @file FilterPanel — sidebar filter container for search and catalog views.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FilterPanelProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FilterPanel({ title = "Filters", children, footer, className }: FilterPanelProps) {
  return (
    <aside className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4", className)} aria-label={title}>
      <h2 className="font-display text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <div className="mt-4 space-y-6">{children}</div>
      {footer ? <div className="mt-6 border-t border-[var(--color-border)] pt-4">{footer}</div> : null}
    </aside>
  );
}
