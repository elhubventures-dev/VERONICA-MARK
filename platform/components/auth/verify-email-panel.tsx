"use client";

import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import * as React from "react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { CsrfField } from "@/components/auth/csrf-field";
import { requestEmailVerificationAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerifyEmailPanelProps = {
  email?: string;
  csrfToken: string;
  pending?: boolean;
};

export function VerifyEmailPanel({ email: initialEmail = "", csrfToken, pending = true }: VerifyEmailPanelProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleResend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await requestEmailVerificationAction({ email, csrfToken });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess("If your account requires verification, a new email has been sent.");
    } catch {
      setError("We could not send a verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] p-4">
        <Mail className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
        <div>
          <p className="font-medium text-[var(--color-foreground)]">
            {pending ? "Email verification pending" : "Resend verification email"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {pending
              ? "Open the link we sent to confirm your email address before continuing."
              : "Enter your email to receive a new verification link."}
          </p>
        </div>
      </div>

      {error ? <AuthAlert variant="error" title="Unable to resend" message={error} className="mb-6" /> : null}
      {success ? <AuthAlert variant="success" title="Email sent" message={success} className="mb-6" /> : null}

      <form onSubmit={handleResend} className="space-y-5" noValidate>
        <CsrfField token={csrfToken} />

        <div className="space-y-2">
          <Label htmlFor="verify-email">Email</Label>
          <Input
            id="verify-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />
        </div>

        <Button type="submit" variant="outline" className="h-11 w-full" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        Verified already?{" "}
        <Link href="/auth/sign-in" className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
