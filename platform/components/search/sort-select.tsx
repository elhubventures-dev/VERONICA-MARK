/**
 * @file SortSelect — sort order dropdown for search results.
 */

"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SortOption {
  value: string;
  label: string;
}

export interface SortSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export function SortSelect({ value, onValueChange, options, className }: SortSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-[var(--color-muted-foreground)]">Sort by</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]" aria-label="Sort results">
          <SelectValue placeholder="Select sort" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
