"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { editorialCtaClass, luxuryFrameClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RailBannerProps = {
  src: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Editorial product-rail banner — left-aligned copy over full-bleed media.
 * Kept as a client island so the rail itself can stay a server component.
 */
export function RailBanner({
  src,
  title,
  description,
  ctaLabel,
  ctaHref = "/categories/perfumes",
}: RailBannerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative mb-10 isolate min-h-[220px] overflow-hidden bg-[var(--color-brand-deep)] text-white sm:min-h-[280px] lg:min-h-[320px]",
        luxuryFrameClass,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
        quality={75}
        className={
          reduceMotion
            ? "-z-20 object-cover object-[78%_center]"
            : "-z-20 scale-110 object-cover object-[78%_center] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-100 vm-ambient-drift"
        }
      />
      <MediaScrim variant="left" />

      <div className="relative z-[1] flex min-h-[220px] items-center px-6 py-10 sm:min-h-[280px] sm:px-10 sm:py-12 lg:min-h-[320px] lg:px-14">
        <motion.div
          className="max-w-[28rem] sm:max-w-[32rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={motionTransition(reduceMotion, 0.55)}
        >
          <div
            aria-hidden
            className="mb-5 h-px w-10 bg-[var(--color-accent)] sm:mb-6"
          />
          <h2 className="font-display text-[1.75rem] leading-[1.12] tracking-[-0.01em] text-balance sm:text-4xl sm:leading-[1.1] lg:text-[2.75rem] lg:leading-[1.08]">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-white/78 sm:mt-5 sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
          {ctaLabel ? (
            <Link href={ctaHref} className={cn("mt-7 sm:mt-8", editorialCtaClass)}>
              {ctaLabel}
            </Link>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
