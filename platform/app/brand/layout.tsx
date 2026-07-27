import { redirect } from "next/navigation";

import { BrandShell } from "@/components/brand/brand-shell";
import { auth } from "@/lib/auth";
import { getBrandWorkspace } from "@/lib/brand/queries";

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/brand");
  }

  if (session.user.role !== "BRAND_MANAGER" && session.user.role !== "SUPER_ADMIN") {
    redirect("/forbidden");
  }

  const workspace = await getBrandWorkspace();

  return (
    <BrandShell
      userName={session.user.name ?? workspace.managerName}
      userEmail={session.user.email ?? workspace.managerEmail}
      brandName={workspace.brandName}
    >
      {children}
    </BrandShell>
  );
}
