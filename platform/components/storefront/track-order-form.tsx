"use client";

import Link from "next/link";
import * as React from "react";

import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { OrderTimeline } from "@/components/commerce/order-timeline";
import { trackOrderAction, type TrackOrderResult } from "@/features/track-order/actions";
import { brandFillCtaClass } from "@/lib/motion";
import { storefrontContact } from "@/lib/storefront/contact";

export function TrackOrderForm() {
  const [message, setMessage] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<Extract<TrackOrderResult, { ok: true }>["order"] | null>(
    null,
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const orderNumber = String(data.get("order") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!orderNumber || !email) {
      setResult(null);
      setMessage("Enter both your order reference and email address.");
      return;
    }

    setPending(true);
    setMessage("");
    setResult(null);

    try {
      const response = await trackOrderAction({ orderNumber, email });
      if (response.ok) {
        setResult(response.order);
        setMessage("");
      } else {
        setMessage(response.message);
      }
    } catch {
      setMessage(
        `We could not look up your order right now. Please try again or call ${storefrontContact.phone}.`,
      );
    } finally {
      setPending(false);
    }
  }

  const trackingHref = result?.trackingNumber
    ? `https://www.17track.net/en/track#nums=${encodeURIComponent(result.trackingNumber)}`
    : null;

  return (
    <div className="mt-10">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="order-reference" className="mb-2 block text-sm font-semibold">
            Order reference
          </label>
          <input
            id="order-reference"
            name="order"
            autoComplete="off"
            disabled={pending}
            className="min-h-11 w-full border border-border bg-surface px-4 focus:border-accent focus:outline-none disabled:opacity-60"
            placeholder="VM-000000"
          />
        </div>
        <div>
          <label htmlFor="order-email" className="mb-2 block text-sm font-semibold">
            Email address
          </label>
          <input
            id="order-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={pending}
            className="min-h-11 w-full border border-border bg-surface px-4 focus:border-accent focus:outline-none disabled:opacity-60"
          />
        </div>
        <button type="submit" className={brandFillCtaClass} disabled={pending}>
          {pending ? "Looking up…" : "Track order"}
        </button>
        <p aria-live="polite" className="min-h-6 text-sm text-muted-foreground">
          {message}
          {message.includes("couldn’t") || message.includes("could not") ? (
            <>
              {" "}
              <Link href="/contact" className="font-semibold underline">
                Contact us
              </Link>
            </>
          ) : null}
        </p>
      </form>

      {result ? (
        <div className="mt-12 border-t border-border pt-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Order {result.orderNumber}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Placed {result.placedAtLabel}
                {result.itemCount > 0
                  ? ` · ${result.itemCount} item${result.itemCount === 1 ? "" : "s"}`
                  : null}
              </p>
              <div className="mt-3">
                <OrderStatusBadge status={result.status} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {trackingHref ? (
                <a
                  href={trackingHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                >
                  Track parcel {result.trackingNumber}
                </a>
              ) : null}
              <Link href={`/invoices/${result.orderNumber}`} className="font-semibold underline">
                View invoice
              </Link>
            </div>
          </div>

          <OrderTimeline className="mt-8" events={result.timeline} />
        </div>
      ) : null}
    </div>
  );
}
