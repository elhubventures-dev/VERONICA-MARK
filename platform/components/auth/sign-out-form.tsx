"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { CsrfField } from "@/components/auth/csrf-field";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

type SignOutFormProps = {
  csrfToken: string;
};

export function SignOutForm({ csrfToken }: SignOutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSignOut(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signOutAction({ csrfToken });
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("We could not sign you out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] sm:p-8">
      {error ? (
        <p className="mb-4 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}
      <form onSubmit={handleSignOut} className="flex flex-col gap-3 sm:flex-row">
        <CsrfField token={csrfToken} />
        <Button type="submit" className="h-11 flex-1" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Signing out…
            </>
          ) : (
            "Sign out"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1"
          disabled={loading}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
        Changed your mind?{" "}
        <Link href="/account" className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
          Return to account
        </Link>
      </p>
    </div>
  );
}
