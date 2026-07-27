"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { TrustSignals } from "@/components/storefront/trust-signals";
import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";

export function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const orderFromUrl = searchParams.get("order");
  const [orderNumber, setOrderNumber] = React.useState(orderFromUrl ?? "VM-2026-0001");
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("vm-last-order");
      if (stored) {
        const parsed = JSON.parse(stored) as { orderNumber?: string };
        if (parsed.orderNumber) setOrderNumber(parsed.orderNumber);
      }
    } catch {
      // use URL or default
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
      <motion.div
        className="text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition(reduceMotion, 0.5)}
      >
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,var(--color-surface))] text-[var(--color-success)]">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <h1 className="font-display mt-6 text-3xl sm:text-4xl">Thank you for choosing VERONICA MARK</h1>
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          We are delighted to be part of your luxury shopping experience. Order{" "}
          <strong className="text-[var(--color-foreground)]">{orderNumber}</strong> is confirmed. A
          receipt and tracking details will arrive by email shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={`/invoices/${orderNumber}`}>View invoice</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/track-order">Track your order</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </motion.div>

      <TrustSignals variant="compact" className="mt-12" />
      <p className="mt-6 text-center text-xs tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
        Curated for the Exceptional.
      </p>
    </div>
  );
}
