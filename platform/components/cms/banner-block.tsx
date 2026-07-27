/**
 * @file BannerBlock — informational banner for CMS-managed announcements.
 */

"use client";

import { Info } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BannerBlockProps {
  title: string;
  body?: string;
  variant?: "info" | "warning" | "success";
  className?: string;
}

const variantStyles = {
  info: "border-[var(--color-info)] bg-[color-mix(in_srgb,var(--color-info)_10%,var(--color-surface))]",
  warning: "border-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-surface))]",
  success: "border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-surface))]",
} as const;

export function BannerBlock({ title, body, variant = "info", className }: BannerBlockProps) {
  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4", variantStyles[variant], className)} role="note">
      <Info className="mt-0.5 size-5 shrink-0 text-[var(--color-info)]" aria-hidden />
      <div>
        <p className="font-medium text-[var(--color-foreground)]">{title}</p>
        {body ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{body}</p> : null}
      </div>
    </aside>
  );
}
