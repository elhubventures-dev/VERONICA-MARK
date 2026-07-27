"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { editorialCtaClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type EditorialBannerProps = {
  src: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Copy alignment over the media plane. */
  align?: "left" | "right";
  /** Minimum section height. */
  minHeight?: "md" | "lg";
  /** Soften LCP pressure on below-fold banners. */
  priority?: boolean;
};

const minHeightClass = {
  md: "min-h-[420px]",
  lg: "min-h-[520px]",
} as const;

/**
 * Full-bleed editorial band — scroll reveal, hover zoom, polished CTA.
 * Shared by homepage featured / gifting / collection sections.
 */
export function EditorialBanner({
  src,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  align = "left",
  minHeight = "md",
  priority = false,
}: EditorialBannerProps) {
  const reduceMotion = useReducedMotion();
  const isRight = align === "right";

  return (
    <section
      className={cn(
        "group relative isolate overflow-hidden bg-[var(--color-brand-deep)] text-white",
        minHeightClass[minHeight],
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={70}
        className={cn(
          "-z-20 object-cover",
          reduceMotion
            ? undefined
            : "scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-100",
        )}
      />
      <MediaScrim variant={isRight ? "right" : "left"} />

      <div
        className={cn(
          "relative mx-auto flex max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:px-12",
          minHeightClass[minHeight],
          isRight && "justify-end",
        )}
      >
        <motion.div
          className={cn("max-w-xl", isRight && "max-w-lg text-right")}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={motionTransition(reduceMotion, 0.55)}
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
            {eyebrow}
          </p>
          <h2
            className={cn(
              "mt-4 font-display text-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)]",
              minHeight === "lg" ? "sm:text-6xl" : "sm:text-5xl",
            )}
          >
            {title}
          </h2>
          <p className={cn("mt-5 leading-7 text-white/90", isRight && "text-white/95")}>
            {description}
          </p>
          <Link href={ctaHref} className={cn("mt-8", editorialCtaClass)}>
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
