/**
 * @file MediaGallery — responsive grid gallery for brand assets.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { ImageThumbnail } from "@/components/media/image-thumbnail";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface MediaGalleryProps {
  items: GalleryItem[];
  onSelect?: (item: GalleryItem) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-4" } as const;

export function MediaGallery({ items, onSelect, columns = 3, className }: MediaGalleryProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={cn("grid gap-3", colClasses[columns], className)}>
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={motionTransition(reduceMotion, 0.2 + i * 0.03)}
        >
          <ImageThumbnail src={item.src} alt={item.alt} onClick={onSelect ? () => onSelect(item) : undefined} />
        </motion.li>
      ))}
    </ul>
  );
}
