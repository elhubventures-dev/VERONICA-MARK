"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { CsrfField } from "@/components/auth/csrf-field";
import { PasswordInput } from "@/components/forms/password-input";
import { resetPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/constants";

type ResetPasswordFormProps = {
  token: string;
  csrfToken: string;
};

export function ResetPasswordForm({ token, csrfToken }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await resetPasswordAction({
        token,
        password,
        confirmPassword,
        csrfToken,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess("Your password has been updated. Redirecting to sign in…");
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 1500);
    } catch {
      setError("We could not reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      {error ? <AuthAlert variant="error" title="Reset failed" message={error} className="mb-6" /> : null}
      {success ? <AuthAlert variant="success" title="Password updated" message={success} className="mb-6" /> : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <CsrfField token={csrfToken} />

        <PasswordInput
          id="reset-password"
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          At least {PASSWORD_MIN_LENGTH} characters with uppercase, lowercase, and a number.
        </p>

        <PasswordInput
          id="reset-confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" className="h-11 w-full" disabled={loading || Boolean(success)} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Updating password…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        <Link href="/auth/sign-in" className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
          Return to sign in
        </Link>
      </p>
    </div>
  );
}
