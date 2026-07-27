"use client";

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
import { flashSale } from "@/lib/storefront/demo-catalog";
import { siteMedia } from "@/lib/storefront/site-media";

const STORAGE_KEY = "vm-flash-sale-popup-seen-at";
const COOLDOWN_MS = 48 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 900;

/** Paths where the promo popup would interrupt a focused flow. */
const SUPPRESSED_PATHS = ["/flash-sale", "/checkout", "/cart", "/account"];

function isFlashSaleRelevant(now = Date.now()) {
  return now <= new Date(flashSale.endsAt).getTime();
}

function shouldSuppressPath(pathname: string) {
  return SUPPRESSED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function readLastSeen(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

function remainingToTarget() {
  const now = Date.now();
  const startsAt = new Date(flashSale.startsAt).getTime();
  const endsAt = new Date(flashSale.endsAt).getTime();
  const target = now < startsAt ? startsAt : endsAt;
  const delta = target - now;
  if (delta <= 0) return null;
  return {
    phase: now < startsAt ? ("upcoming" as const) : ("live" as const),
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta / 3_600_000) % 24),
    minutes: Math.floor((delta / 60_000) % 60),
    seconds: Math.floor((delta / 1000) % 60),
  };
}

export function FlashSalePopup() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<ReturnType<typeof remainingToTarget>>(null);

  React.useEffect(() => {
    if (!isFlashSaleRelevant()) {
      setOpen(false);
      return;
    }
    if (shouldSuppressPath(pathname)) {
      setOpen(false);
      return;
    }

    const lastSeen = readLastSeen();
    if (lastSeen !== null && Date.now() - lastSeen < COOLDOWN_MS) return;

    const timer = window.setTimeout(() => {
      markSeen();
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const tick = () => setTime(remainingToTarget());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  if (!isFlashSaleRelevant()) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[var(--color-brand-deep)] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:max-w-lg [&_button.absolute]:text-white [&_button.absolute]:opacity-80 [&_button.absolute]:hover:opacity-100">
        <div className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--color-brand-deep)]">
          <Image
            src={siteMedia.seasonalCollection}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 32rem"
            className="-z-20 object-cover object-center brightness-[0.45] saturate-[0.85]"
            priority={false}
          />
          {/* Heavy veil so gold/white copy stays readable over bright photography */}
          <div
            className="-z-10 absolute inset-0 bg-[color-mix(in_srgb,var(--color-brand-deep)_72%,transparent)]"
            aria-hidden
          />
          <MediaScrim variant="center" withAccent={false} className="opacity-95" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-14 pb-8 text-center sm:px-10 sm:pb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,.65)]">
              {time?.phase === "upcoming" ? "Opens 1 August" : "August Grand Opening"}
            </p>
            <DialogTitle className="mt-3 font-display text-3xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,.7)] sm:text-4xl">
              {flashSale.title}
            </DialogTitle>
            <DialogDescription className="mt-3 max-w-sm text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,.6)]">
              {flashSale.discountPercent ?? 20}% off with code{" "}
              <span className="font-semibold tracking-wide text-[var(--color-accent)]">
                {flashSale.couponCode ?? "VM5AUG-20"}
              </span>{" "}
              — available 1–7 August.
            </DialogDescription>

            {time ? (
              <div className="mt-7 flex flex-wrap justify-center gap-2.5" aria-label="Time remaining">
                {(
                  [
                    ["Days", time.days],
                    ["Hours", time.hours],
                    ["Mins", time.minutes],
                    ["Secs", time.seconds],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-[4.25rem] border px-2.5 py-2.5"
                    style={{
                      backgroundColor: "#c7a25a",
                      color: "#3a013c",
                      borderColor: "#3a013c",
                    }}
                  >
                    <div className="font-display text-xl tabular-nums sm:text-2xl">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-[10px] tracking-[0.16em] uppercase opacity-80">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <Link
              href="/flash-sale"
              className="mt-8 inline-flex min-h-11 w-full max-w-xs items-center justify-center border border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-brand-deep)_88%,black)] px-6 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            >
              View the opening edit
            </Link>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-4 min-h-10 text-xs tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
