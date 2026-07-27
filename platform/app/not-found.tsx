import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">404</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-sm leading-6 text-[var(--color-muted-foreground)]">
        The page you requested is unavailable. It may have moved, or the link may be incorrect.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Shop fragrances</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </main>
  );
}
