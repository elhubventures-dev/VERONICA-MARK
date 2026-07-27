"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";

export function HeroBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[var(--color-brand-deep)] text-white">
      <Image
        src={siteMedia.homepageHeroBanner}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <MediaScrim variant="left" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition(reduceMotion, 0.7)}
        className="mx-auto w-full max-w-[1440px] px-5 pt-28 pb-16 sm:px-8 sm:pb-24 lg:px-12"
      >
        <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-[var(--color-accent)] uppercase">
          VERONICA MARK
        </p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] text-balance sm:text-7xl lg:text-8xl">
          Curated for the Exceptional.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
          Discover carefully selected luxury perfumes, fashion, accessories and lifestyle products
          from trusted brands around the world.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/categories/perfumes"
            className="inline-flex min-h-11 items-center justify-center bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]"
          >
            Explore the collection
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center justify-center border border-[color-mix(in_srgb,var(--color-accent)_55%,white)] px-7 text-sm font-semibold text-white transition-colors hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
          >
            Our story
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
