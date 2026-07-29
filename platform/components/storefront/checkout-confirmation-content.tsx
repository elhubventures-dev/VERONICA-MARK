"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { BrandMark } from "@/components/layout/brand-mark";
import { TrustSignals } from "@/components/storefront/trust-signals";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { motionTransition } from "@/lib/motion";

type LastOrder = {
  orderNumber?: string;
  name?: string;
};

function firstNameFrom(fullName: string | undefined) {
  if (!fullName?.trim()) return null;
  return fullName.trim().split(/\s+/)[0] ?? null;
}

export function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const orderFromUrl = searchParams.get("order");
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = React.useState(orderFromUrl ?? "");
  const [patronName, setPatronName] = React.useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("vm-last-order");
      if (stored) {
        const parsed = JSON.parse(stored) as LastOrder;
        if (parsed.orderNumber) setOrderNumber(parsed.orderNumber);
        setPatronName(firstNameFrom(parsed.name));
      }
    } catch {
      // use URL or empty
    }
  }, []);

  // Belt-and-suspenders: empty the bag once payment succeeded (callback also clears).
  React.useEffect(() => {
    if (!orderFromUrl) return;
    clearCart();
  }, [orderFromUrl, clearCart]);

  const greeting = patronName ? `Dear ${patronName},` : "Dear Patron,";
  const displayOrder = orderNumber || "your order";

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_55%),linear-gradient(180deg,color-mix(in_srgb,var(--color-brand-deep)_6%,var(--color-background)),var(--color-background)_42%)]"
      />

      <div className="relative mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-20">
        <motion.article
          role="status"
          aria-live="polite"
          className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_42%,var(--color-border))] bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={motionTransition(reduceMotion, 0.55)}
        >
          <div className="relative bg-[linear-gradient(145deg,var(--color-brand-deep),var(--color-brand-field)_55%,var(--color-brand-ink))] px-6 pb-10 pt-8 text-center text-white sm:px-10">
            <motion.div
              className="mx-auto"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={motionTransition(reduceMotion, 0.45)}
            >
              <BrandMark href={null} variant="monogram" size={56} className="justify-center" />
            </motion.div>

            <p className="mt-6 text-[0.68rem] font-semibold tracking-[0.28em] text-[var(--color-accent)] uppercase">
              Order confirmed
            </p>

            <motion.div
              className="mx-auto mt-5 flex size-12 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-[var(--color-accent)]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ...motionTransition(reduceMotion, 0.4),
                delay: reduceMotion ? 0 : 0.18,
              }}
            >
              <Check className="size-5" strokeWidth={2.5} aria-hidden />
            </motion.div>
          </div>

          <div className="relative px-6 pb-10 pt-8 text-center sm:px-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-accent)_70%,transparent),transparent)]"
            />

            <p className="font-display text-lg italic text-[var(--color-muted-foreground)] sm:text-xl">
              {greeting}
            </p>

            <h1 className="font-display mt-3 text-3xl leading-tight text-[var(--color-foreground)] sm:text-4xl">
              Thank you for choosing VERONICA MARK
            </h1>

            <p className="mx-auto mt-4 max-w-md text-[var(--color-muted-foreground)]">
              It is our privilege to welcome you as a valued patron. Your order{" "}
              <strong className="font-medium text-[var(--color-foreground)]">{displayOrder}</strong>{" "}
              is confirmed — a receipt and tracking details will arrive by email shortly.
            </p>

            {orderNumber ? (
              <div className="mx-auto mt-8 max-w-sm border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-5 py-4">
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[var(--color-muted-foreground)] uppercase">
                  Order reference
                </p>
                <p className="mt-1 font-alt text-lg tracking-wide text-[var(--color-foreground)]">
                  {orderNumber}
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {orderNumber ? (
                <Button asChild>
                  <Link href={`/invoices/${orderNumber}`}>View invoice</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href="/track-order">Track your order</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </div>

            <p className="mt-8 text-xs tracking-[0.18em] text-[var(--color-muted-foreground)] uppercase">
              Curated for the Exceptional.
            </p>
          </div>
        </motion.article>

        <TrustSignals variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
