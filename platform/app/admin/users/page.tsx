import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminUsers } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "Review platform users, administrative roles, and access status across the VERONICA MARK ecosystem.",
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoleVariant(role: "SUPER_ADMIN" | "BRAND_MANAGER" | "CUSTOMER") {
  switch (role) {
    case "SUPER_ADMIN":
      return "default";
    case "BRAND_MANAGER":
      return "secondary";
    case "CUSTOMER":
    default:
      return "outline";
  }
}

function getStatusVariant(status: "active" | "invited" | "disabled") {
  switch (status) {
    case "active":
      return "success";
    case "invited":
      return "warning";
    case "disabled":
    default:
      return "error";
  }
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Users"
        description="Monitor administrative and customer identities, track access status, and keep role assignments aligned with platform responsibility."
      />

      {users.length ? (
        <section aria-label="User directory" className="space-y-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{user.name}</h2>
                    <Badge variant={getRoleVariant(user.role)} className="rounded-lg">
                      {user.role.replaceAll("_", " ")}
                    </Badge>
                    <Badge variant={getStatusVariant(user.status)} className="rounded-lg capitalize">
                      {user.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Role:</span>{" "}
                      {user.role.replaceAll("_", " ")}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Last active:</span>{" "}
                      {formatTimestamp(user.lastActiveAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  {user.status === "invited" ? (
                    <AdminDemoButton
                      label="Resend invite"
                      message={`Invitation resent to ${user.email} in demo mode.`}
                      variant="default"
                    />
                  ) : (
                    <AdminDemoButton
                      label="Invite admin"
                      message="New admin invite flow opened in demo mode."
                      variant="default"
                    />
                  )}
                  {user.status !== "disabled" ? (
                    <AdminDemoButton
                      label="Disable user"
                      message={`${user.email} disabled in demo mode.`}
                      variant="destructive"
                    />
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No users found"
          description="Administrative invites and customer records will appear here as the marketplace identity graph expands."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
