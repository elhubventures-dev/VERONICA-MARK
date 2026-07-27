/**
 * @file ErrorState — error feedback with retry action for failed data loads.
 */

"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_8%,var(--color-surface))] px-6 py-10 text-center", className)} role="alert">
      <AlertTriangle className="size-10 text-[var(--color-error)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>Try again</Button>
      ) : null}
    </div>
  );
}
