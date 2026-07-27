import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/account-shell";
import { auth } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <AccountShell userName={session.user.name ?? "Member"} userEmail={session.user.email ?? ""}>
      {children}
    </AccountShell>
  );
}
