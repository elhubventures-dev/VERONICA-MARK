import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";
import { getHomePathForRole } from "@/lib/auth/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect(getHomePathForRole(session.user.role));
  }

  return (
    <AdminShell userName={session.user.name ?? "Super Admin"} userEmail={session.user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
