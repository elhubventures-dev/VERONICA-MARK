/**
 * @file PromoBanner — promotional CTA strip for campaigns and brand launches.
 */

"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PromoBannerProps {
  headline: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function PromoBanner({ headline, description, ctaLabel, ctaHref, className }: PromoBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 rounded-xl bg-[var(--color-brand-deep)] px-6 py-5 text-white sm:flex-row sm:items-center",
        className,
      )}
    >
      <div>
        <p className="font-display text-lg font-semibold">{headline}</p>
        {description ? <p className="mt-1 text-sm text-white/85">{description}</p> : null}
      </div>
      <Button asChild variant="secondary" className={focusRingClass}>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
