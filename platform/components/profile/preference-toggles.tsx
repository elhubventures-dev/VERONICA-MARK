/**
 * @file PreferenceToggles — account preference switches grouped by category.
 */

"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface PreferenceItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}

export interface PreferenceTogglesProps {
  title?: string;
  items: PreferenceItem[];
  onChange: (id: string, checked: boolean) => void;
  className?: string;
}

export function PreferenceToggles({ title = "Preferences", items, onChange, className }: PreferenceTogglesProps) {
  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <ul className="mt-4 divide-y divide-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
              {item.description ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p> : null}
            </div>
            <Switch
              id={item.id}
              checked={item.checked}
              onCheckedChange={(checked: boolean) => onChange(item.id, checked)}
              aria-label={item.label}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
