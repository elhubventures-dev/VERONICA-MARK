/**
 * @file ImageThumbnail — selectable image thumbnail with hover overlay.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ImageThumbnailProps {
  src: string;
  alt: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ImageThumbnail({ src, alt, selected, onClick, className }: ImageThumbnailProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-[var(--color-muted)]",
        selected ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]" : "border-[var(--color-border)]",
        onClick && focusRingClass,
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-contain transition-transform group-hover:scale-105" sizes="200px" />
      {onClick ? (
        <span className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral)_0%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-neutral)_25%,transparent)]" aria-hidden />
      ) : null}
    </Comp>
  );
}
