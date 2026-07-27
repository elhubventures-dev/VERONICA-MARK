/**
 * @file ActiveFilters — row of applied filters with clear-all action.
 */

"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/search/filter-chip";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Active filters">
      {filters.map((f) => (
        <FilterChip key={f.id} label={f.label} onRemove={onRemove ? () => onRemove(f.id) : undefined} />
      ))}
      {onClearAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
