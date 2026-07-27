"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { captureClientException } from "@/lib/observability/client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientException(error, { digest: error.digest, boundary: "segment-error" });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
        Error
      </p>
      <h1 className="mt-4 font-display text-3xl sm:text-4xl">We could not load this page</h1>
      <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
        A recoverable error occurred. Retry the action, or continue shopping from the storefront.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Browse shop</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
