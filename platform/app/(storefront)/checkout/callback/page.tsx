"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

import { useCart } from "@/features/cart/cart-context";

function CallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [message, setMessage] = React.useState("Confirming your Paystack payment…");

  React.useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) {
      setMessage("Missing payment reference. Return to checkout and try again.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(
          `/api/checkout/paystack/verify?reference=${encodeURIComponent(reference)}`,
        );
        const payload = (await response.json()) as {
          data?: { orderNumber: string };
          error?: { message?: string };
        };

        if (!response.ok || !payload.data?.orderNumber) {
          throw new Error(payload.error?.message || "Payment verification failed");
        }

        if (cancelled) return;

        clearCart();
        sessionStorage.setItem(
          "vm-last-order",
          JSON.stringify({
            orderNumber: payload.data.orderNumber,
            reference,
          }),
        );
        router.replace(`/checkout/confirmation?order=${encodeURIComponent(payload.data.orderNumber)}`);
      } catch (error) {
        if (cancelled) return;
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not confirm this payment. If you were charged, contact client services with your Paystack reference.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
        Paystack
      </p>
      <h1 className="mt-3 font-display text-3xl">Securing your order</h1>
      <p className="mt-4 text-[var(--color-muted-foreground)]" role="status">
        {message}
      </p>
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="px-5 py-24 text-center text-[var(--color-muted-foreground)]">
          Confirming payment…
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
