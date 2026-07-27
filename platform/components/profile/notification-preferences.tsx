/**
 * @file NotificationPreferences — email and push notification opt-in controls.
 */

"use client";

import { Bell } from "lucide-react";
import * as React from "react";

import { PreferenceToggles } from "@/components/profile/preference-toggles";
import { cn } from "@/lib/utils";

export interface NotificationPreferencesProps {
  values: Record<string, boolean>;
  onChange: (id: string, checked: boolean) => void;
  className?: string;
}

const defaultItems = [
  { id: "orders", label: "Order updates", description: "Shipping confirmations and delivery alerts" },
  { id: "promotions", label: "Brand promotions", description: "New launches from your favourite brands" },
  { id: "newsletter", label: "Newsletter", description: "Curated edits and fragrance journal" },
];

export function NotificationPreferences({ values, onChange, className }: NotificationPreferencesProps) {
  const items = defaultItems.map((item) => ({ ...item, checked: values[item.id] ?? false }));

  return (
    <div className={cn(className)}>
      <div className="mb-4 flex items-center gap-2">
        <Bell className="size-5 text-[var(--color-accent)]" aria-hidden />
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
      </div>
      <PreferenceToggles title="Email preferences" items={items} onChange={onChange} />
    </div>
  );
}
