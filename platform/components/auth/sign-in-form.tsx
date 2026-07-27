"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { CsrfField } from "@/components/auth/csrf-field";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn } from "@/lib/auth/client";
import { navigateAfterAuth, resolvePostAuthPath } from "@/lib/auth/post-auth-redirect";

type SignInFormProps = {
  csrfToken: string;
  callbackUrl?: string;
};

export function SignInForm({ csrfToken, callbackUrl }: SignInFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const provisionalDestination = resolvePostAuthPath({ callbackUrl });
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: provisionalDestination,
      });

      if (result?.error) {
        setError("The email or password you entered is incorrect.");
        setLoading(false);
        return;
      }

      const session = await getSession();
      const destination = resolvePostAuthPath({
        callbackUrl,
        role: session?.user?.role,
      });
      navigateAfterAuth(destination);
    } catch {
      setError("We could not sign you in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      <div className="mb-6 h-px w-12 bg-[var(--color-accent)]" aria-hidden />

      {error ? <AuthAlert variant="error" title="Sign in failed" message={error} className="mb-6" /> : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <CsrfField token={csrfToken} />

        <div className="space-y-2">
          <Label htmlFor="sign-in-email">Email</Label>
          <Input
            id="sign-in-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(error)}
            placeholder="you@example.com"
          />
        </div>

        <PasswordInput
          id="sign-in-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <Link
            href={`/auth/forgot-password${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="min-h-[var(--touch-target)] leading-[var(--touch-target)] text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="h-11 w-full" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-[var(--color-border)]" />
        </div>
        <p className="relative mx-auto w-fit bg-[var(--color-surface)] px-3 text-xs tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
          or continue with
        </p>
      </div>

      <GoogleSignInButton callbackUrl={callbackUrl} disabled={loading} />

      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        New to VERONICA MARK?{" "}
        <Link
          href={`/auth/sign-up${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
