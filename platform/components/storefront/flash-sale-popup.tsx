"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  CountdownBlocks,
  flashSaleCountdownUnits,
} from "@/components/storefront/countdown-blocks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, motionTransition } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/flash-sale-config";
import {
  formatFlashSaleWindowLocal,
  getFlashSaleRemaining,
} from "@/lib/storefront/flash-sale-time";
import { siteMedia } from "@/lib/storefront/site-media";
import {
  ENGAGEMENT_POPUP_OPEN_DELAY_MS,
  isFlashSalePopupOnCooldown,
  markFlashSalePopupSeen,
  registerStorefrontVisit,
} from "@/lib/storefront/visitor";

/** Paths where the promo popup would interrupt a focused flow. */
const SUPPRESSED_PATHS = ["/flash-sale", "/checkout", "/cart", "/account", "/auth"];

function isFlashSaleRelevant(now = Date.now()) {
  return now <= new Date(flashSale.endsAt).getTime();
}

function shouldSuppressPath(pathname: string) {
  return SUPPRESSED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function remainingToTarget() {
  return getFlashSaleRemaining();
}

export function FlashSalePopup() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<ReturnType<typeof remainingToTarget>>(null);
  const [localWindow, setLocalWindow] = React.useState<string | null>(null);

  React.useEffect(() => {
    const visitCount = registerStorefrontVisit();

    if (!isFlashSaleRelevant()) {
      setOpen(false);
      return;
    }
    if (shouldSuppressPath(pathname)) {
      setOpen(false);
      return;
    }

    // First-time visitors only — returning guests get WelcomeBackPopup.
    if (visitCount >= 2) return;
    if (isFlashSalePopupOnCooldown()) return;

    const timer = window.setTimeout(() => {
      markFlashSalePopupSeen();
      setOpen(true);
    }, ENGAGEMENT_POPUP_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const tick = () => {
      setTime(remainingToTarget());
      setLocalWindow(formatFlashSaleWindowLocal());
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  if (!isFlashSaleRelevant()) return null;

  const stagger = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { ...motionTransition(reduceMotion, 0.4), delay: reduceMotion ? 0 : delay },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[var(--color-brand-deep)] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:max-w-lg [&_button.absolute]:text-white [&_button.absolute]:opacity-80 [&_button.absolute]:hover:opacity-100">
        <div className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--color-brand-deep)]">
          <div
            aria-hidden
            className="vm-ambient-orb absolute top-10 left-[-3rem] -z-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_24%,transparent)] blur-3xl"
          />
          <div
            aria-hidden
            className="vm-ambient-orb absolute right-[-3rem] bottom-12 -z-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,white_12%,transparent)] blur-3xl"
          />
          <Image
            src={siteMedia.seasonalCollection}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 32rem"
            className={reduceMotion
              ? "-z-20 object-cover object-center brightness-[0.45] saturate-[0.85]"
              : "-z-20 object-cover object-center brightness-[0.45] saturate-[0.85] vm-ambient-drift"}
            priority={false}
          />
          <div
            className="-z-10 absolute inset-0 bg-[color-mix(in_srgb,var(--color-brand-deep)_72%,transparent)]"
            aria-hidden
          />
          <MediaScrim variant="center" withAccent={false} className="opacity-95" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-14 pb-8 text-center sm:px-10 sm:pb-10">
            <motion.p
              {...stagger(0.05)}
              className="text-[11px] font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,.65)]"
            >
              {time?.phase === "upcoming" ? "Launches 1st August" : "August Grand Launch"}
            </motion.p>
            <motion.div {...stagger(0.12)}>
              <DialogTitle className="mt-3 font-display text-3xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,.7)] sm:text-4xl">
                {flashSale.title}
              </DialogTitle>
            </motion.div>
            <motion.div {...stagger(0.18)}>
              <DialogDescription className="mt-3 max-w-sm text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,.6)]">
                Shop {flashSale.discountPercent ?? 20}% Off All Items with Code:{" "}
                <span className="font-semibold tracking-wide text-[var(--color-accent)]">
                  {flashSale.couponCode ?? "VMA5AUG"}
                </span>{" "}
                — {localWindow ? `Your local time: ${localWindow}` : "Valid from 1st - 15th August 2026 (West Africa Time)"}
              </DialogDescription>
            </motion.div>

            {time ? (
              <motion.div {...stagger(0.24)} className="mx-auto mt-7 w-fit">
                <CountdownBlocks
                  units={flashSaleCountdownUnits(time)}
                  size="sm"
                  className="flex flex-wrap justify-center gap-2.5"
                />
              </motion.div>
            ) : null}

            <motion.div
              {...stagger(0.3)}
              className="mx-auto mt-8 flex w-[18.875rem] flex-col items-stretch"
            >
              <Link href="/flash-sale" className={`w-full justify-center ${accentFillCtaClass}`}>
                FLASH SALES
              </Link>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-4 min-h-10 text-center text-xs tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
              >
                Continue browsing
              </button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
