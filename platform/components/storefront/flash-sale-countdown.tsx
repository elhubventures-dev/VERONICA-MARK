"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  CountdownBlocks,
  flashSaleCountdownUnits,
} from "@/components/storefront/countdown-blocks";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { Reveal } from "@/components/storefront/reveal";
import { editorialCtaClass } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { getFlashSaleRemaining } from "@/lib/storefront/flash-sale-time";
import { siteMedia } from "@/lib/storefront/site-media";

export function FlashSaleCountdown() {
  const [time, setTime] = React.useState<ReturnType<typeof getFlashSaleRemaining>>();

  React.useEffect(() => {
    const update = () => setTime(getFlashSaleRemaining());
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
      <Reveal className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto]">
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
          <div className="flex w-[20.25rem] flex-col items-stretch gap-4 lg:ml-auto">
            <CountdownBlocks units={flashSaleCountdownUnits(time)} size="md" />
            <Link href="/flash-sale" className={`w-full justify-center ${editorialCtaClass}`}>
              View the opening edit
            </Link>
          </div>
        ) : (
          <Link href="/shop" className={editorialCtaClass}>
            Shop the collection
          </Link>
        )}
      </Reveal>
    </section>
  );
}
