import type { Metadata } from "next";
import Link from "next/link";

import { AuthAlert } from "@/components/auth/auth-alert";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "We could not complete your sign-in request.",
};

const AUTH_ERROR_COPY: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "Service unavailable",
    message: "Authentication is temporarily unavailable. Please try again shortly.",
  },
  AccessDenied: {
    title: "Access denied",
    message: "You do not have permission to sign in with this method.",
  },
  Verification: {
    title: "Link expired",
    message: "This sign-in link has expired or was already used. Request a new one to continue.",
  },
  OAuthSignin: {
    title: "Sign-in interrupted",
    message: "We could not start the external sign-in flow. Please try again.",
  },
  OAuthCallback: {
    title: "Sign-in incomplete",
    message: "We could not finish signing you in with your external account.",
  },
  OAuthCreateAccount: {
    title: "Account unavailable",
    message: "We could not create an account from your external profile.",
  },
  EmailCreateAccount: {
    title: "Account unavailable",
    message: "We could not create an account with that email address.",
  },
  Callback: {
    title: "Sign-in incomplete",
    message: "Something went wrong during sign-in. Please try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account not linked",
    message:
      "This email is already associated with another sign-in method. Use your original method or contact support.",
  },
  EmailSignin: {
    title: "Email sign-in failed",
    message: "We could not send or validate the email sign-in link.",
  },
  CredentialsSignin: {
    title: "Invalid credentials",
    message: "The email or password you entered is incorrect.",
  },
  SessionRequired: {
    title: "Sign in required",
    message: "Please sign in to continue to the requested page.",
  },
  Default: {
    title: "Authentication error",
    message: "We could not complete sign-in. Please try again.",
  },
};

type AuthErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const code = params.error ?? "Default";
  const copy = AUTH_ERROR_COPY[code] ?? AUTH_ERROR_COPY.Default;

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          {copy?.title}
        </h1>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
        <AuthAlert variant="error" title={copy?.title ?? "Authentication error"} message={copy?.message ?? ""} />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 flex-1">
            <Link href="/auth/sign-in">Back to sign in</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
