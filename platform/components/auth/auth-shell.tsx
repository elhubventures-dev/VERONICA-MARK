"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "@/components/layout/brand-mark";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { editorialCtaClass, motionTransition } from "@/lib/motion";
import { storefrontContact } from "@/lib/storefront/contact";
import {
  flashSale,
  OPENING_COUPON_CODE,
  OPENING_DISCOUNT_PERCENT,
} from "@/lib/storefront/demo-catalog";
import { siteMedia } from "@/lib/storefront/site-media";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

const panelHighlights = [
  "Track orders and invoices in one place",
  "Save favourites to your private wishlist",
  "Authenticity assured on every purchase",
  `${OPENING_DISCOUNT_PERCENT}% off with code ${OPENING_COUPON_CODE} · 1–15 August`,
] as const;

export function AuthShell({ children, title, description, className }: AuthShellProps) {
  const reduceMotion = useReducedMotion();
  const discount = flashSale.discountPercent ?? OPENING_DISCOUNT_PERCENT;
  const coupon = flashSale.couponCode ?? OPENING_COUPON_CODE;

  return (
    <div className="relative min-h-svh overflow-hidden bg-[var(--color-background)] lg:grid lg:grid-cols-2">
      <aside className="relative isolate hidden min-h-svh overflow-hidden bg-[var(--color-brand-deep)] lg:flex lg:flex-col">
        <Image
          src={siteMedia.authenticationBanner}
          alt=""
          fill
          priority
          sizes="50vw"
          className="-z-20 object-cover"
        />
        <MediaScrim variant="left" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-brand-deep)_92%,transparent)_0%,transparent_55%)]"
        />

        <div className="relative z-10 flex flex-1 flex-col p-10 xl:p-14">
          <BrandMark
            variant="monogram"
            withWordmark
            size={40}
            className="shrink-0 text-white [&_span]:text-white"
            priority
          />

          <div aria-hidden className="shrink-0" style={{ height: "7.5rem" }} />

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(reduceMotion, 0.6)}
            className="max-w-md text-white"
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              Client account
            </p>
            <p className="mt-3 font-display text-4xl leading-tight text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] xl:text-5xl">
              Curated for the Exceptional.
            </p>
            <p className="mt-5 text-sm leading-7 text-white/85">
              Your private doorway to the VERONICA MARK edit — orders, wishlist and considered
              recommendations, with the same care as every purchase.
            </p>
            <ul className="mt-8 space-y-3 border-t border-white/15 pt-8">
              {panelHighlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/90">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-brand-deep)_55%,transparent)] px-4 py-3">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
                Opening courtesy
              </p>
              <p className="mt-1.5 text-sm text-white/90">
                {discount}% off with code{" "}
                <span className="font-semibold tracking-wide text-[var(--color-accent)]">
                  {coupon}
                </span>{" "}
                at checkout — Private Launch Page, 1–15 August.
              </p>
              <Link
                href="/flash-sale"
                className="mt-2 inline-flex text-xs font-semibold tracking-[0.12em] text-white/80 uppercase underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline"
              >
                FLASH SALES
              </Link>
            </div>

            <Link href="/shop" className={`mt-8 ${editorialCtaClass}`}>
              Explore the collection
            </Link>
          </motion.div>
        </div>
      </aside>

      <div className="relative mx-auto flex min-h-svh w-full max-w-lg flex-col px-6 py-10 text-[var(--color-foreground)] sm:px-8 sm:py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
          <Image
            src={siteMedia.authenticationBanner}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-brand-deep)_96%,transparent)_0%,color-mix(in_srgb,var(--color-brand-field)_90%,transparent)_48%,color-mix(in_srgb,var(--color-brand-deep)_97%,transparent)_100%)]" />
        </div>

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition(reduceMotion, 0.5)}
          className="relative text-center lg:text-left"
        >
          <BrandMark
            variant="icon"
            withWordmark
            size={44}
            className="justify-center text-[var(--color-foreground)] max-lg:text-white lg:justify-start"
            priority
          />
          {title ? (
            <h1 className="mt-7 font-display text-3xl font-semibold text-balance text-[var(--color-foreground)] max-lg:text-white sm:text-4xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)] max-lg:text-white/80 sm:text-base lg:mx-0">
              {description}
            </p>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted-foreground)] max-lg:text-white/75">
            Opening offer: {discount}% off with{" "}
            <span className="font-semibold text-[var(--color-primary)] max-lg:text-[var(--color-accent)]">
              {coupon}
            </span>{" "}
            ·{" "}
            <Link href="/flash-sale" className="underline-offset-2 hover:underline">
              Private Launch Page
            </Link>
          </p>
        </motion.header>

        <main
          className={cn(
            "relative mt-8 flex flex-1 flex-col justify-center",
            "max-lg:[&>div:first-child_h1]:text-white max-lg:[&>div:first-child_p]:text-white/80",
            className,
          )}
        >
          {children}
        </main>

        <footer className="relative mt-10 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-muted-foreground)] max-lg:border-white/20 max-lg:text-white/75 lg:text-left">
          <nav
            aria-label="Auth footer"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start"
          >
            <Link
              href="/"
              className="min-h-[var(--touch-target)] leading-[var(--touch-target)] transition-colors hover:text-[var(--color-primary)] max-lg:hover:text-[var(--color-accent)]"
            >
              Storefront
            </Link>
            <Link
              href="/auth/sign-in"
              className="min-h-[var(--touch-target)] leading-[var(--touch-target)] transition-colors hover:text-[var(--color-primary)] max-lg:hover:text-[var(--color-accent)]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="min-h-[var(--touch-target)] leading-[var(--touch-target)] transition-colors hover:text-[var(--color-primary)] max-lg:hover:text-[var(--color-accent)]"
            >
              Create account
            </Link>
            <Link
              href="/contact"
              className="min-h-[var(--touch-target)] leading-[var(--touch-target)] transition-colors hover:text-[var(--color-primary)] max-lg:hover:text-[var(--color-accent)]"
            >
              Contact
            </Link>
          </nav>
          <p className="mt-3 text-xs text-[var(--color-muted-foreground)] max-lg:text-white/60">
            <a
              href={storefrontContact.telUrl}
              className="underline-offset-2 hover:underline"
            >
              {storefrontContact.phone}
            </a>
            {" · "}
            <a
              href={`mailto:${storefrontContact.email}`}
              className="underline-offset-2 hover:underline"
            >
              {storefrontContact.email}
            </a>
            {" · "}
            <a
              href={storefrontContact.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              {storefrontContact.websiteLabel}
            </a>
          </p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)] max-lg:text-white/55">
            {storefrontContact.addressLine}
          </p>
        </footer>
      </div>
    </div>
  );
}
