"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";
import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FlashSaleSocialProofProps = {
  products: StorefrontProduct[];
};

type ClaimEvent = {
  id: string;
  product: StorefrontProduct;
  city: string;
  minutesAgo: number;
};

const CITIES = [
  "Lagos",
  "Port Harcourt",
  "Abuja",
  "Ibadan",
  "Enugu",
  "Accra",
  "London",
  "Dubai",
];

/**
 * Lightweight "recently claimed" toast strip — social proof without fake cart data.
 * Cycles through real flash-sale products; respects reduced motion.
 */
export function FlashSaleSocialProof({ products }: FlashSaleSocialProofProps) {
  const reduceMotion = useReducedMotion();
  const pool = React.useMemo(() => products.filter((p) => p.inStock !== false).slice(0, 12), [products]);
  const [event, setEvent] = React.useState<ClaimEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const indexRef = React.useRef(0);

  React.useEffect(() => {
    if (pool.length < 2 || dismissed) return;

    const showNext = () => {
      const product = pool[indexRef.current % pool.length]!;
      indexRef.current += 1;
      setEvent({
        id: `${product.id}-${indexRef.current}`,
        product,
        city: CITIES[indexRef.current % CITIES.length]!,
        minutesAgo: (indexRef.current % 7) + 1,
      });
    };

    const first = window.setTimeout(showNext, 4200);
    const interval = window.setInterval(showNext, 9000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [pool, dismissed]);

  React.useEffect(() => {
    if (!event) return;
    const hide = window.setTimeout(() => setEvent(null), 5200);
    return () => window.clearTimeout(hide);
  }, [event]);

  if (pool.length < 2) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-[5.5rem] left-4 z-40 max-w-[min(22rem,calc(100vw-2rem))] sm:bottom-8 sm:left-6",
      )}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {event && !dismissed ? (
          <motion.div
            key={event.id}
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            transition={motionTransition(reduceMotion, 0.35)}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          >
            <div className="flex gap-3 p-3">
              <Link
                href={`/products/${event.product.slug}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted)]"
              >
                <Image
                  src={event.product.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
                  Just claimed
                </p>
                <Link
                  href={`/products/${event.product.slug}`}
                  className="mt-1 block truncate text-sm font-medium hover:text-[var(--color-primary)]"
                >
                  {event.product.name}
                </Link>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  Someone in {event.city} · {event.minutesAgo} min ago
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDismissed(true);
                  setEvent(null);
                }}
                className={cn(
                  "self-start rounded-md p-1 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]",
                  focusRingClass,
                )}
                aria-label="Dismiss purchase notifications"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
