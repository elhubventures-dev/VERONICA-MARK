/**
 * @file MediaBlock — image or video block for CMS pages with caption support.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MediaBlockProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "video" | "square" | "wide";
  className?: string;
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
} as const;

export function MediaBlock({ src, alt, caption, aspectRatio = "wide", className }: MediaBlockProps) {
  return (
    <figure className={cn("overflow-hidden rounded-xl", className)}>
      <div className={cn("relative bg-[var(--color-muted)]", aspectClasses[aspectRatio])}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 960px" />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-[var(--color-muted-foreground)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
