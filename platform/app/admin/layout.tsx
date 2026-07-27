import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/forbidden");
  }

  return (
    <AdminShell userName={session.user.name ?? "Super Admin"} userEmail={session.user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
