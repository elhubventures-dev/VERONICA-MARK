"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactOrderSupportAction } from "@/features/contact/actions";

type Status = "idle" | "error" | "success" | "pending";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactOrderForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const orderNumber = String(data.get("order") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !orderNumber || !message) {
      setStatus("error");
      setError("Please complete all required fields, including your order reference.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }

    setStatus("pending");
    setError("");
    const result = await submitContactOrderSupportAction({
      name,
      email,
      orderNumber,
      message,
    });
    if (!result.ok) {
      setStatus("error");
      setError(result.message);
      return;
    }
    setStatus("success");
    form.reset();
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      noValidate
      className="space-y-5"
      aria-describedby="order-support-status"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order-support-name">Full name</Label>
          <Input
            id="order-support-name"
            name="name"
            autoComplete="name"
            required
            disabled={status === "pending"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-support-email">Email used at checkout</Label>
          <Input
            id="order-support-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "pending"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-support-reference">Order reference</Label>
        <Input
          id="order-support-reference"
          name="order"
          placeholder="VM-2026-0001"
          autoComplete="off"
          required
          disabled={status === "pending"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-support-message">How can we help?</Label>
        <Textarea
          id="order-support-message"
          name="message"
          rows={4}
          placeholder="Delivery update, change of address, product question…"
          required
          disabled={status === "pending"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" className="min-w-[10rem]" disabled={status === "pending"}>
          {status === "pending" ? "Sending…" : "Submit request"}
        </Button>
        <Link
          href="/track-order"
          className="text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
        >
          Track an existing order
        </Link>
      </div>

      <p
        id="order-support-status"
        aria-live="polite"
        className="min-h-6 text-sm text-[var(--color-muted-foreground)]"
      >
        {status === "error"
          ? error
          : status === "success"
            ? "Request received. We’ll follow up with an update on your order shortly."
            : "Include your order reference so we can assist with clarity and care."}
      </p>
    </form>
  );
}
