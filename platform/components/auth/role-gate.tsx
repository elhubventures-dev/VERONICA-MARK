"use client";

import type { UserRole } from "@prisma/client";
import type { ReactNode } from "react";

import { useSession } from "@/lib/auth/client";

type RoleGateProps = {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user?.role || !allow.includes(session.user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
