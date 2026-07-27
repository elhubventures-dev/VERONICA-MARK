import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";
import { getServerCsrfToken } from "@/lib/auth/get-server-csrf";
import { resolvePostAuthPath } from "@/lib/auth/post-auth-redirect";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your VERONICA MARK account for orders, wishlist and curated luxury shopping.",
};

type SignUpPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
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
          Join the house
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
          One elegant account for the collection, your orders and saved favourites.
        </p>
      </div>
      <SignUpForm csrfToken={csrfToken} callbackUrl={callbackUrl} />
    </>
  );
}
