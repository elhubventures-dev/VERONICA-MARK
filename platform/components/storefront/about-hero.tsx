"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, ghostOnDarkCtaClass, motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";

export function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden bg-[var(--color-brand-deep)] text-white sm:min-h-[85svh]">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={reduceMotion ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={motionTransition(reduceMotion, 1.35)}
      >
        <Image
          src={siteMedia.aboutUsBanner}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <MediaScrim variant="center" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-brand-deep) 70%, transparent) 0%, transparent 55%)",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition(reduceMotion, 0.7)}
        className="relative mx-auto w-full max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-32"
      >
        <p className="text-sm font-semibold tracking-[0.35em] text-[var(--color-accent)] uppercase">
          VERONICA MARK
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-7xl lg:text-8xl">
          Curated for the Exceptional.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
          Founded in Nigeria to redefine how luxury is discovered, experienced, and trusted.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className={accentFillCtaClass}>
            Explore the collection
          </Link>
          <a href="#our-story" className={ghostOnDarkCtaClass}>
            Our story
          </a>
        </div>
      </motion.div>
    </section>
  );
}
