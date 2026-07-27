"use client";

import * as React from "react";

import { submitNewsletterSignupAction } from "@/features/contact/actions";

export function NewsletterForm() {
  const [status, setStatus] = React.useState<"idle" | "error" | "success" | "pending">("idle");
  const [message, setMessage] = React.useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = String(new FormData(form).get("email") ?? "").trim();
    if (!raw) {
      setStatus("error");
      setMessage("Enter your email address to join.");
      return;
    }

    setStatus("pending");
    const result = await submitNewsletterSignupAction({ email: raw });
    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    setStatus("success");
    setMessage(result.message);
    form.reset();
  }

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="mx-auto mt-8 max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          disabled={status === "pending"}
          aria-describedby="newsletter-status"
          className="min-h-11 flex-1 border border-white/30 bg-transparent px-4 text-white placeholder:text-white/55 focus:border-accent focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="min-h-11 bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] disabled:opacity-60"
        >
          {status === "pending" ? "Joining…" : "Join the list"}
        </button>
      </div>
      <p id="newsletter-status" aria-live="polite" className="mt-3 min-h-6 text-sm text-white/75">
        {status === "error" || status === "success"
          ? message
          : "Curated launches, new houses and refined fragrance notes."}
      </p>
    </form>
  );
}
