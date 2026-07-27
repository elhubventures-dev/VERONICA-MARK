/**
 * @file EmptyCart — empty bag state with editorial messaging and CTA.
 * Shown in cart drawer, bag page, and checkout guard rails.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";
import { cn } from "@/lib/utils";

export interface EmptyCartProps {
  className?: string;
  onContinueShopping?: () => void;
  ctaHref?: string;
}

export function EmptyCart({
  className,
  onContinueShopping,
  ctaHref = "/shop",
}: EmptyCartProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion, 0.45)}
      className={cn(
        "flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)] text-center",
        className,
      )}
    >
      <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden">
        <Image
          src={siteMedia.emptyCartIllustration}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 28rem"
          className="object-cover"
        />
      </div>
      <div className="px-6 py-8">
        <h3 className="font-display text-xl">Your bag awaits its signature scent</h3>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
          Explore curated compositions from the world&apos;s finest maisons — each bottle authenticated
          and managed by VERONICA MARK.
        </p>
        {onContinueShopping ? (
          <Button className="mt-6" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        ) : (
          <Button asChild className="mt-6">
            <Link href={ctaHref}>Discover Fragrances</Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
