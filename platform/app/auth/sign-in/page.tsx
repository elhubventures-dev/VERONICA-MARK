import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";
import { resolvePostAuthPath } from "@/lib/auth/post-auth-redirect";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your VERONICA MARK account to track orders, wishlist and rewards.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  const session = await auth();

  if (session?.user) {
    redirect(
      resolvePostAuthPath({
        callbackUrl,
        role: session.user.role,
      }),
    );
  }

  const csrfToken = await getServerCsrfToken();

  return (
    <>
      <div className="mb-6 text-center lg:text-left">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase max-lg:text-[var(--color-accent)] lg:text-[var(--color-primary)]">
          Welcome back
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl">
          Sign in to your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
          Access orders, wishlist and your private VERONICA MARK experience.
        </p>
      </div>
      <SignInForm csrfToken={csrfToken} callbackUrl={callbackUrl} />
    </>
  );
}
