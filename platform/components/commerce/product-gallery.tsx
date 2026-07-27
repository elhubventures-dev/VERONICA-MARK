/**
 * @file ProductGallery — PDP image gallery with thumbnails and lightbox zoom.
 */

"use client";

import { Expand, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface ProductGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoomed, setZoomed] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const active = images[activeIndex];

  React.useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed, images.length]);

  if (!active || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("grid gap-4 md:grid-cols-[88px_1fr]", className)}>
        <ul className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 md:size-[88px]",
                  focusRingClass,
                  index === activeIndex
                    ? "border-[var(--color-accent)]"
                    : "border-transparent hover:border-[var(--color-border)]",
                )}
              >
                <Image src={image.src} alt="" fill sizes="88px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>

        <motion.div
          key={active.src}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={motionTransition(reduceMotion, 0.25)}
          className="relative order-1 w-full overflow-hidden rounded-xl bg-[var(--color-muted)] md:order-2"
          style={{ aspectRatio: "1 / 1" }}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            priority
            fetchPriority="high"
            quality={75}
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className={cn(
              "absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/30 bg-black/55 px-3 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70",
              focusRingClass,
            )}
            aria-label="Zoom image"
          >
            <Expand className="size-3.5" aria-hidden />
            Zoom
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {zoomed ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Product image zoom"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setZoomed(false)}
          >
            <button
              type="button"
              aria-label="Close zoom"
              className={cn(
                "absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/25 text-white",
                focusRingClass,
              )}
              onClick={() => setZoomed(false)}
            >
              <X className="size-5" aria-hidden />
            </button>
            <div
              className="relative h-[min(85svh,900px)] w-full max-w-3xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
