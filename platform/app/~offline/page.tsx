import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 py-16 text-center">
      <p className="font-display text-sm tracking-[0.2em] text-[var(--color-muted-foreground)] uppercase">
        VERONICA MARK
      </p>
      <h1 className="mt-4 font-display text-3xl text-[var(--color-foreground)] sm:text-4xl">
        You are offline
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-[var(--color-muted-foreground)]">
        We could not reach the network. Check your connection, then try again to continue browsing
        the collection.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Try again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Browse shop</Link>
        </Button>
      </div>
    </div>
  );
}
