"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useSession } from "@/lib/auth/client";

type RequireAuthProps = {
  children: ReactNode;
  callbackUrl?: string;
};

export function RequireAuth({ children, callbackUrl }: RequireAuthProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const destination = callbackUrl ?? pathname ?? "/account";
      router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent(destination)}`);
    }
  }, [status, router, pathname, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-[var(--color-primary)]" aria-hidden />
        <span className="sr-only">Loading your session…</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
