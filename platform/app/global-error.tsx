"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { captureClientException } from "@/lib/observability/client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientException(error, { digest: error.digest, boundary: "global-error" });
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-[#F8F4EC] px-6 text-[#1a1a1a]">
        <div className="max-w-md text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">VERONICA MARK</p>
          <h1 className="mt-4 font-serif text-3xl">Something went wrong</h1>
          <p className="mt-3 text-sm text-[#5c5c5c]">
            An unexpected error interrupted this page. You can try again or return home.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-[#8a8a8a]">Reference: {error.digest}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
