/**
 * @file RichText — semantic renderer for CMS HTML content with token-based typography.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none text-[var(--color-foreground)] [&_a]:text-[var(--color-primary)] [&_h2]:font-display [&_h3]:font-display [&_p]:text-[var(--color-muted-foreground)]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
