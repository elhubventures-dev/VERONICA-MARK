"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, ghostOnDarkCtaClass, motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";
import {
  ENGAGEMENT_POPUP_OPEN_DELAY_MS,
  isWelcomeBackPopupOnCooldown,
  markWelcomeBackPopupSeen,
  registerStorefrontVisit,
} from "@/lib/storefront/visitor";

/** Paths where a greeting popup would interrupt a focused flow. */
const SUPPRESSED_PATHS = ["/checkout", "/cart", "/account", "/auth"];

function shouldSuppressPath(pathname: string) {
  return SUPPRESSED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function WelcomeBackPopup() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const visitCount = registerStorefrontVisit();

    if (shouldSuppressPath(pathname)) {
      setOpen(false);
      return;
    }

    if (visitCount < 2) return;
    if (isWelcomeBackPopupOnCooldown()) return;

    const timer = window.setTimeout(() => {
      markWelcomeBackPopupSeen();
      setOpen(true);
    }, ENGAGEMENT_POPUP_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  const stagger = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { ...motionTransition(reduceMotion, 0.45), delay: reduceMotion ? 0 : delay },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[var(--color-brand-deep)] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:max-w-lg [&_button.absolute]:text-white [&_button.absolute]:opacity-80 [&_button.absolute]:hover:opacity-100">
        <div className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--color-brand-deep)]">
          <div
            aria-hidden
            className="vm-ambient-orb absolute top-8 left-[-2.5rem] -z-10 h-36 w-36 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] blur-3xl"
          />
          <div
            aria-hidden
            className="vm-ambient-orb absolute right-[-3rem] bottom-8 -z-10 h-44 w-44 rounded-full bg-[color-mix(in_srgb,white_10%,transparent)] blur-3xl"
          />
          <Image
            src={siteMedia.luxuryLifestyleBanner}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 32rem"
            className={
              reduceMotion
                ? "-z-20 object-cover object-center brightness-[0.42] saturate-[0.9]"
                : "-z-20 object-cover object-center brightness-[0.42] saturate-[0.9] vm-ambient-drift"
            }
            priority={false}
          />
          <div
            className="-z-10 absolute inset-0 bg-[color-mix(in_srgb,var(--color-brand-deep)_68%,transparent)]"
            aria-hidden
          />
          <MediaScrim variant="center" withAccent={false} className="opacity-95" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-14 pb-8 text-center sm:px-10 sm:pb-10">
            <motion.p
              {...stagger(0.04)}
              className="text-[11px] font-semibold tracking-[0.28em] text-[var(--color-accent)] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,.65)]"
            >
              Returning guest
            </motion.p>

            <motion.div
              {...stagger(0.1)}
              aria-hidden
              className="mt-5 h-px w-12 bg-[color-mix(in_srgb,var(--color-accent)_70%,transparent)]"
            />

            <motion.div {...stagger(0.14)}>
              <DialogTitle className="mt-5 font-display text-4xl leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,.7)] sm:text-5xl">
                Welcome back
              </DialogTitle>
            </motion.div>

            <motion.div {...stagger(0.2)}>
              <DialogDescription className="mt-4 max-w-sm text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,.6)]">
                The edit is still open for you — curated maisons, considered scents, and
                new arrivals waiting to be discovered.
              </DialogDescription>
            </motion.div>

            <motion.div
              {...stagger(0.28)}
              className="mx-auto mt-9 flex w-[18.875rem] flex-col items-stretch gap-3"
            >
              <Link href="/shop" className={`w-full justify-center ${accentFillCtaClass}`}>
                Continue shopping
              </Link>
              <Link
                href="/shop?sort=newest"
                className={`w-full justify-center ${ghostOnDarkCtaClass}`}
              >
                See what&apos;s new
              </Link>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-1 min-h-10 text-center text-xs tracking-[0.14em] text-white/75 uppercase transition-colors hover:text-white"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
