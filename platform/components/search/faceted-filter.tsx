/**
 * @file FacetedFilter — multi-select facet group with checkboxes.
 */

"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

export interface FacetedFilterProps {
  title: string;
  options: FacetOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FacetedFilter({ title, options, selected, onChange, className }: FacetedFilterProps) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-[var(--color-foreground)]">{title}</legend>
      <ul className="space-y-2">
        {options.map((opt) => {
          const id = `${title}-${opt.value}`;
          return (
            <li key={opt.value} className="flex items-center gap-2">
              <Checkbox id={id} checked={selected.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
              <Label htmlFor={id} className="flex flex-1 cursor-pointer justify-between font-normal">
                <span>{opt.label}</span>
                {opt.count !== undefined ? (
                  <span className="text-[var(--color-muted-foreground)]">{opt.count}</span>
                ) : null}
              </Label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
