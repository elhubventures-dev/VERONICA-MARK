"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { CsrfField } from "@/components/auth/csrf-field";
import { requestPasswordResetAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ForgotPasswordFormProps = {
  csrfToken: string;
};

export function ForgotPasswordForm({ csrfToken }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await requestPasswordResetAction({ email, csrfToken });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess(
        "If an account exists for that email, we have sent password reset instructions.",
      );
      setEmail("");
    } catch {
      setError("We could not process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      {error ? <AuthAlert variant="error" title="Request failed" message={error} className="mb-6" /> : null}
      {success ? (
        <AuthAlert variant="success" title="Check your inbox" message={success} className="mb-6" />
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <CsrfField token={csrfToken} />

        <div className="space-y-2">
          <Label htmlFor="forgot-password-email">Email</Label>
          <Input
            id="forgot-password-email"
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

        <Button type="submit" className="h-11 w-full" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        Remember your password?{" "}
        <Link href="/auth/sign-in" className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
