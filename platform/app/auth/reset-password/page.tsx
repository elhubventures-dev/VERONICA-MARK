import type { Metadata } from "next";
import Link from "next/link";

import { AuthAlert } from "@/components/auth/auth-alert";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your VERONICA MARK account.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token?.trim();
  const csrfToken = await getServerCsrfToken();

  if (!token) {
    return (
      <>
        <div className="mb-2 text-center">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
            Invalid reset link
          </h1>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
          <AuthAlert
            variant="error"
            title="Link unavailable"
            message="This password reset link is missing or incomplete. Request a new link to continue."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 flex-1">
              <Link href="/auth/forgot-password">Request new link</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 flex-1">
              <Link href="/auth/sign-in">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          Choose a new password
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Use a strong password you have not used on VERONICA MARK before.
        </p>
      </div>
      <ResetPasswordForm token={token} csrfToken={csrfToken} />
    </>
  );
}
