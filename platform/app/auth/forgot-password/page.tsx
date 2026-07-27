import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a secure password reset link for your VERONICA MARK account.",
};

export default async function ForgotPasswordPage() {
  const csrfToken = await getServerCsrfToken();

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Enter the email associated with your account and we will send reset instructions.
        </p>
      </div>
      <ForgotPasswordForm csrfToken={csrfToken} />
    </>
  );
}
