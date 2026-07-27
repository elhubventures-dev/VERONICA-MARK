import type { Metadata } from "next";

import { SignOutForm } from "@/components/auth/sign-out-form";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your VERONICA MARK session.",
};

export default async function SignOutPage() {
  const csrfToken = await getServerCsrfToken();

  return (
    <>
      <div className="mb-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">
          Sign out
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          You are about to leave your VERONICA MARK session on this device.
        </p>
      </div>
      <SignOutForm csrfToken={csrfToken} />
    </>
  );
}
