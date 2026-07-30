"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  CountdownBlocks,
  flashSaleCountdownUnits,
} from "@/components/storefront/countdown-blocks";
import { FlashSaleCouponCopy } from "@/components/storefront/flash-sale-coupon-copy";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, ghostOnDarkCtaClass, motionTransition } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { getFlashSaleRemaining } from "@/lib/storefront/flash-sale-time";
import { siteMedia } from "@/lib/storefront/site-media";

type FlashSaleLandingProps = {
  productCount: number;
  highlightedCount: number;
  brands: string[];
};

const promoPills = [
  "Real catalog markdowns",
  "Limited inventory drops",
  "Tax-inclusive pricing",
  "Fast premium dispatch",
];

/**
 * Full-bleed advert landing for /flash-sale — urgency, offer, countdown, CTA.
 * Homepage keeps FlashSaleCountdown; this page is the campaign destination.
 */
export function FlashSaleLanding({
  productCount,
  highlightedCount,
  brands,
}: FlashSaleLandingProps) {
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
      ? "Launches 1st August"
      : phase === "live"
        ? "Live now · Limited days"
        : "Launch event";

  const discountPercent = flashSale.discountPercent ?? 20;
  const couponCode = flashSale.couponCode ?? "VMA5AUG";
  const brandLine = brands.slice(0, 4).join("  •  ");

  const supporting =
    phase === "upcoming"
      ? `Shop ${discountPercent}% Off All Items with Code: ${couponCode} - Valid from 1st - 15th August 2026`
      : phase === "live"
        ? `Shop ${discountPercent}% Off All Items with Code: ${couponCode} - Valid from 1st - 15th August 2026`
        : "This launch has closed. Explore the full collection for enduring signatures.";

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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] top-[14%] -z-10 h-40 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] blur-3xl"
        initial={reduceMotion ? false : { opacity: 0.35, scale: 0.92 }}
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.52, 0.28], scale: [0.96, 1.05, 0.96] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <motion.div
          className="flex min-w-max gap-8 px-6 py-3 text-[0.68rem] font-semibold tracking-[0.28em] text-white/80 uppercase"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 18,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
          }
        >
          {Array.from({ length: 2 }).flatMap((_, index) =>
            promoPills.map((pill) => (
              <span key={`${pill}-${index}`} className="whitespace-nowrap">
                {pill}
              </span>
            )),
          )}
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-28 sm:px-8 sm:py-32">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
          <div className="text-center lg:text-left">
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
              <h1 className="mt-4 font-display text-5xl leading-[1.02] text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-7xl lg:text-[5.5rem]">
                {flashSale.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg lg:max-w-xl">
                {supporting}
              </p>
              {brandLine ? (
                <p className="mt-5 text-[0.72rem] font-medium tracking-[0.22em] text-white/65 uppercase">
                  Featured in this campaign: {brandLine}
                </p>
              ) : null}
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionTransition(reduceMotion, 0.7), delay: reduceMotion ? 0 : 0.12 }}
              className="mt-10 flex flex-col items-center lg:items-start"
            >
              {ready && time ? (
                <>
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
                    {phase === "upcoming" ? "Opens in" : "Ends in"}
                  </p>
                  <CountdownBlocks
                    units={flashSaleCountdownUnits(time)}
                    size="lg"
                    className="flex flex-wrap justify-center gap-2.5 sm:gap-3 lg:justify-start"
                  />
                </>
              ) : ready ? (
                <p className="text-sm text-white/80">The private opening window has closed.</p>
              ) : (
                <div className="flex justify-center gap-3 lg:justify-start" aria-hidden>
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
              className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {ready && !time ? (
                <Link href="/shop" className={accentFillCtaClass}>
                  Explore the collection
                </Link>
              ) : (
                <>
                  <a href="#opening-edit" className={accentFillCtaClass}>
                    FLASH SALES
                  </a>
                  <Link href="/shop" className={ghostOnDarkCtaClass}>
                    Browse all fragrances
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...motionTransition(reduceMotion, 0.7), delay: reduceMotion ? 0 : 0.18 }}
            className="rounded-[1.75rem] border border-white/15 bg-[color-mix(in_srgb,var(--color-brand-deep)_72%,transparent)] p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[var(--color-accent)] uppercase">
                  Promo code
                </p>
                <p className="mt-2 text-sm text-white/70">Tap to copy — paste at checkout</p>
              </div>
              <div className="rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                Save {discountPercent}%
              </div>
            </div>

            <div className="mt-4">
              <FlashSaleCouponCopy code={couponCode} variant="dark" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[0.68rem] tracking-[0.18em] text-white/60 uppercase">Live products</p>
                <p className="mt-2 text-3xl font-semibold">{productCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[0.68rem] tracking-[0.18em] text-white/60 uppercase">Hot picks</p>
                <p className="mt-2 text-3xl font-semibold">{highlightedCount}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Authentic managed-brand fragrances only",
                "Luxury gifting and personal signatures in one drop",
                "Offer auto-applies at checkout with the promo code",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/84">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
