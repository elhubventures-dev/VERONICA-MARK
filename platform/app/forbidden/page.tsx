import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Forbidden",
  description: "You do not have permission to view this area.",
};

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-display text-3xl text-[var(--color-primary)]">VERONICA MARK</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-[var(--color-foreground)]">Access denied</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
        Your account does not have permission to view this area. If you believe this is a mistake,
        sign in with a different account or return to a page you can access.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 flex-1">
          <Link href="/auth/sign-in">Sign in with another account</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 flex-1">
          <Link href="/account">Go to account</Link>
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        <Link href="/" className="text-[var(--color-primary)] underline-offset-4 hover:underline">
          Return to storefront
        </Link>
      </p>
    </main>
  );
}
