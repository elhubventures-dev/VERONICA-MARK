"use client";

import Link from "next/link";
import * as React from "react";

import { brandFillCtaClass } from "@/lib/motion";

export function TrackOrderForm() {
  const [message, setMessage] = React.useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order = String(data.get("order") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    setMessage(
      order && email
        ? "We couldn’t find a matching dispatch yet. Check your details or contact client services."
        : "Enter both your order reference and email address.",
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
      <div>
        <label htmlFor="order-reference" className="mb-2 block text-sm font-semibold">
          Order reference
        </label>
        <input
          id="order-reference"
          name="order"
          className="min-h-11 w-full border border-border bg-surface px-4 focus:border-accent focus:outline-none"
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
          className="min-h-11 w-full border border-border bg-surface px-4 focus:border-accent focus:outline-none"
        />
      </div>
      <button type="submit" className={brandFillCtaClass}>
        Track order
      </button>
      <p aria-live="polite" className="min-h-6 text-sm text-muted-foreground">
        {message}
        {message.includes("couldn’t") ? (
          <>
            {" "}
            <Link href="/contact" className="font-semibold underline">
              Contact us
            </Link>
          </>
        ) : null}
      </p>
    </form>
  );
}
