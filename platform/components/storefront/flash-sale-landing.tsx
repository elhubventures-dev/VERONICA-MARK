"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  CountdownBlocks,
  flashSaleCountdownUnits,
} from "@/components/storefront/countdown-blocks";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, ghostOnDarkCtaClass, motionTransition } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { getFlashSaleRemaining } from "@/lib/storefront/flash-sale-time";
import { siteMedia } from "@/lib/storefront/site-media";

/**
 * Full-bleed advert landing for /flash-sale — urgency, offer, countdown, CTA.
 * Homepage keeps FlashSaleCountdown; this page is the campaign destination.
 */
export function FlashSaleLanding() {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = React.useState<ReturnType<typeof getFlashSaleRemaining>>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      setTime(getFlashSaleRemaining());
      setReady(true);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const phase = time?.phase;
  const eyebrow =
    phase === "upcoming"
      ? "Opens 1 August"
      : phase === "live"
        ? "Live now · Limited days"
        : "Opening event";

  const discountPercent = flashSale.discountPercent ?? 20;
  const couponCode = flashSale.couponCode ?? "VM5AUG-20";

  const supporting =
    phase === "upcoming"
      ? `${discountPercent}% off with code ${couponCode} — exclusive courtesy on signature compositions. Mark 1–7 August.`
      : phase === "live"
        ? `${discountPercent}% off with code ${couponCode} — exclusive courtesy on signature compositions while stocks last.`
        : "This opening edit has closed. Explore the full collection for enduring signatures.";

  return (
    <section className="relative isolate flex min-h-[88svh] items-center justify-center overflow-hidden bg-[var(--color-brand-deep)] text-white sm:min-h-[92svh]">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={motionTransition(reduceMotion, 1.4)}
      >
        <Image
          src={siteMedia.seasonalCollection}
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-brand-deep)_78%,transparent)_0%,transparent_50%)]"
      />

      <div className="relative mx-auto w-full max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition(reduceMotion, 0.75)}
        >
          <p className="text-sm font-semibold tracking-[0.35em] text-[var(--color-accent)] uppercase">
            VERONICA MARK
          </p>
          <p className="mt-4 text-xs font-semibold tracking-[0.22em] text-white/75 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-7xl lg:text-8xl">
            {flashSale.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            {supporting}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionTransition(reduceMotion, 0.7), delay: reduceMotion ? 0 : 0.12 }}
          className="mt-10 flex flex-col items-center"
        >
          {ready && time ? (
            <>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
                {phase === "upcoming" ? "Opens in" : "Ends in"}
              </p>
              <CountdownBlocks
                units={flashSaleCountdownUnits(time)}
                size="lg"
                className="flex flex-wrap justify-center gap-2.5 sm:gap-3"
              />
            </>
          ) : ready ? (
            <p className="text-sm text-white/80">The private opening window has closed.</p>
          ) : (
            <div className="flex justify-center gap-3" aria-hidden>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[4.75rem] w-[4.75rem] border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-brand-deep)_55%,transparent)] sm:h-[5.5rem] sm:w-[5.25rem]"
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionTransition(reduceMotion, 0.65), delay: reduceMotion ? 0 : 0.22 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {ready && !time ? (
            <Link href="/shop" className={accentFillCtaClass}>
              Explore the collection
            </Link>
          ) : (
            <>
              <a href="#opening-edit" className={accentFillCtaClass}>
                Shop the opening edit
              </a>
              <Link href="/shop" className={ghostOnDarkCtaClass}>
                Browse all fragrances
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
