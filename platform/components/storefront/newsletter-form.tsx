"use client";

import * as React from "react";

export function NewsletterForm() {
  const [status, setStatus] = React.useState<"idle" | "error" | "success">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    if (!email) {
      setStatus("error");
      return;
    }
    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-8 max-w-xl">
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
          aria-describedby="newsletter-status"
          className="min-h-11 flex-1 border border-white/30 bg-transparent px-4 text-white placeholder:text-white/55 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="min-h-11 bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]"
        >
          Join the list
        </button>
      </div>
      <p id="newsletter-status" aria-live="polite" className="mt-3 min-h-6 text-sm text-white/75">
        {status === "error"
          ? "Enter your email address to join."
          : status === "success"
            ? "Welcome to the VERONICA MARK private list."
            : "Curated launches, new houses and refined fragrance notes."}
      </p>
    </form>
  );
}
