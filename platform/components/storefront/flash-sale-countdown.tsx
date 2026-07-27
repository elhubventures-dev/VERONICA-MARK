"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { siteMedia } from "@/lib/storefront/site-media";

function remaining() {
  const now = Date.now();
  const startsAt = new Date(flashSale.startsAt).getTime();
  const endsAt = new Date(flashSale.endsAt).getTime();
  // Before open → count to start; during sale → count to end; after close → hide timer
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

export function FlashSaleCountdown() {
  const [time, setTime] = React.useState<ReturnType<typeof remaining>>();

  React.useEffect(() => {
    const update = () => setTime(remaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="flash-sale" className="relative isolate overflow-hidden px-5 py-14 text-white sm:px-8">
      <Image
        src={siteMedia.seasonalCollection}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <MediaScrim variant="left" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
            {time?.phase === "upcoming" ? "Opens 1 August" : "Limited opening event"}
          </p>
          <h2 className="mt-3 text-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-4xl">
            {flashSale.title}
          </h2>
          <p className="mt-3 max-w-xl text-white/90">
            {(flashSale.discountPercent ?? 20)}% off with code{" "}
            <span className="font-semibold text-[var(--color-accent)]">
              {flashSale.couponCode ?? "VM5AUG-20"}
            </span>
            . {flashSale.description}
          </p>
        </div>
        {time ? (
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap gap-3" aria-label="Time remaining">
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
                  className="min-w-[4.5rem] border px-3 py-3 text-center"
                  style={{
                    backgroundColor: "#c7a25a",
                    color: "#3a013c",
                    borderColor: "#3a013c",
                  }}
                >
                  <div className="font-display text-2xl tabular-nums">{String(value).padStart(2, "0")}</div>
                  <div className="mt-1 text-[10px] tracking-[0.16em] uppercase opacity-80">{label}</div>
                </div>
              ))}
            </div>
            <Link
              href="/flash-sale"
              className="inline-flex min-h-11 items-center justify-center border border-[var(--color-accent)] bg-[var(--color-brand-deep)] px-6 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            >
              View the opening edit
            </Link>
          </div>
        ) : (
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center border border-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
          >
            Shop the collection
          </Link>
        )}
      </div>
    </section>
  );
}
