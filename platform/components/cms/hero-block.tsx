/**
 * @file HeroBlock — full-width hero section for brand storytelling pages.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function HeroBlock({ title, subtitle, ctaLabel, ctaHref, imageSrc, imageAlt, className }: HeroBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion)}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      <div className="relative aspect-[21/9] min-h-[320px]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral)_55%,transparent)]" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <h1 className="font-display max-w-2xl text-3xl font-semibold text-white md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-xl text-lg text-white/90">{subtitle}</p> : null}
          {ctaLabel && ctaHref ? (
            <Button asChild className={cn("mt-6 w-fit", focusRingClass)}>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
