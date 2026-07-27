"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";

export function ContactHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[52svh] items-center justify-center overflow-hidden bg-[var(--color-brand-deep)] text-white sm:min-h-[58svh]">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={reduceMotion ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={motionTransition(reduceMotion, 1.25)}
      >
        <Image
          src={siteMedia.contactPageBanner}
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
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-brand-deep) 72%, transparent) 0%, transparent 55%)",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition(reduceMotion, 0.65)}
        className="relative mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-28"
      >
        <p className="text-sm font-semibold tracking-[0.35em] text-[var(--color-accent)] uppercase">
          VERONICA MARK
        </p>
        <h1 className="mt-5 font-display text-4xl leading-[1.05] text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-6xl">
          How may we assist?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
          Client services for fragrance selection, orders and delivery — with the same care we bring
          to every VERONICA MARK experience.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#write-to-us"
            className="inline-flex min-h-11 items-center justify-center bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]"
          >
            Write to us
          </a>
          <Link
            href="/track-order"
            className="inline-flex min-h-11 items-center justify-center border border-[color-mix(in_srgb,var(--color-accent)_55%,white)] px-7 text-sm font-semibold text-white transition-colors hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
          >
            Track an order
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
