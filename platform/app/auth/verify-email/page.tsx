import type { Metadata } from "next";

import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Confirm your email address for VERONICA MARK.",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const csrfToken = await getServerCsrfToken();

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          Verify your email
        </h1>
      </div>
      <VerifyEmailPanel email={params.email ?? ""} csrfToken={csrfToken} pending />
    </>
  );
}
