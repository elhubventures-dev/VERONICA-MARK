"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthAlert } from "@/components/auth/auth-alert";
import { CsrfField } from "@/components/auth/csrf-field";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordInput } from "@/components/forms/password-input";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/constants";
import { signIn } from "@/lib/auth/client";

type SignUpFormProps = {
  csrfToken: string;
  callbackUrl?: string;
};

const accountPerks = [
  "Faster checkout and order history",
  "Wishlist across devices",
  "Opening edit and launch updates",
] as const;

export function SignUpForm({ csrfToken, callbackUrl = "/account" }: SignUpFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
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
      const result = await registerAction({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        csrfToken,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess("Your account has been created. Signing you in…");

      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (!signInResult?.error) {
        router.push(signInResult?.url ?? callbackUrl);
        router.refresh();
      }
    } catch {
      setError("We could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      <div className="mb-6 h-px w-12 bg-[var(--color-accent)]" aria-hidden />

      <ul className="mb-6 space-y-2 border-b border-[var(--color-border)] pb-6">
        {accountPerks.map((perk) => (
          <li key={perk} className="flex gap-2.5 text-sm text-[var(--color-muted-foreground)]">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
              aria-hidden
            />
            {perk}
          </li>
        ))}
      </ul>

      {error ? <AuthAlert variant="error" title="Registration failed" message={error} className="mb-6" /> : null}
      {success ? <AuthAlert variant="success" title="Welcome" message={success} className="mb-6" /> : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <CsrfField token={csrfToken} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sign-up-first-name">First name</Label>
            <Input
              id="sign-up-first-name"
              name="firstName"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sign-up-last-name">Last name</Label>
            <Input
              id="sign-up-last-name"
              name="lastName"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-phone">Phone number</Label>
          <Input
            id="sign-up-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={loading}
            placeholder="+234 801 234 5678"
          />
        </div>

        <PasswordInput
          id="sign-up-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          At least {PASSWORD_MIN_LENGTH} characters with uppercase, lowercase, and a number.
        </p>

        <PasswordInput
          id="sign-up-confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        <p className="text-xs leading-5 text-[var(--color-muted-foreground)]">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-primary)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-primary)]">
            Privacy Policy
          </Link>
          .
        </p>

        <Button type="submit" className="h-11 w-full" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Creating account…
            </>
          ) : (
            "Create account"
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
        Already have an account?{" "}
        <Link
          href={`/auth/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
