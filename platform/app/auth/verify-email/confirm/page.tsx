import type { Metadata } from "next";
import Link from "next/link";

import { AuthAlert } from "@/components/auth/auth-alert";
import { confirmEmailVerificationAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Email Confirmation",
  description: "Confirm your VERONICA MARK email address.",
};

type ConfirmVerifyEmailPageProps = {
  searchParams: Promise<{ token?: string; email?: string }>;
};

export default async function ConfirmVerifyEmailPage({ searchParams }: ConfirmVerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token?.trim();
  const email = params.email?.trim();

  if (!token || !email) {
    return (
      <>
        <div className="mb-2 text-center">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
            Verification incomplete
          </h1>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
          <AuthAlert
            variant="error"
            title="Invalid link"
            message="This verification link is missing required details. Request a new email from the verification page."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 flex-1">
              <Link href="/auth/verify-email">Resend verification</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 flex-1">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const result = await confirmEmailVerificationAction({ email, token });

  const verified = result.success;
  const message = verified
    ? "Your email address has been verified."
    : result.error.message;

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          {verified ? "Email verified" : "Verification failed"}
        </h1>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
        <AuthAlert
          variant={verified ? "success" : "error"}
          title={verified ? "You are all set" : "Unable to verify"}
          message={message}
        />
        <div className="mt-6">
          <Button asChild className="h-11 w-full sm:w-auto">
            <Link href="/auth/sign-in">Continue to sign in</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
