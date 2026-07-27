/**
 * @file LoadingState — skeleton placeholder for async data views.
 */

"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  rows?: number;
  label?: string;
  className?: string;
}

export function LoadingState({ variant = "skeleton", rows = 4, label = "Loading", className }: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} aria-busy="true">
        <Spinner aria-label={label} />
        <p className="text-sm text-[var(--color-muted-foreground)]">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 rounded-xl border border-[var(--color-border)] p-4", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}
