/**
 * @file MediaLightbox — fullscreen image viewer dialog.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface MediaLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function MediaLightbox({ open, onOpenChange, src, alt, caption, className }: MediaLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-4xl p-0 overflow-hidden", className)}>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">{caption ?? alt}</DialogDescription>
        <div className="relative aspect-video bg-[var(--color-neutral)]">
          <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" />
        </div>
        {caption ? <p className="p-4 text-sm text-[var(--color-muted-foreground)]">{caption}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
