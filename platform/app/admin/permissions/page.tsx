import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminPermissions } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Permissions",
  description: "Review role-based access controls across resources and actions for the platform governance model.",
};

function getRoleVariant(role: string) {
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

export default async function AdminPermissionsPage() {
  const permissions = await getAdminPermissions();
  const groupedByRole = permissions.reduce<Record<string, typeof permissions>>((acc, permission) => {
    const existingPermissions = acc[permission.role] ?? [];
    existingPermissions.push(permission);
    acc[permission.role] = existingPermissions;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Permissions"
        description="Use a matrix-style view of roles, resources, and actions to validate least-privilege access across the platform."
      />

      {permissions.length ? (
        <section aria-label="Permission matrix" className="space-y-6">
          {Object.entries(groupedByRole).map(([role, rolePermissions]) => (
            <article
              key={role}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-[var(--color-foreground)]">{role.replaceAll("_", " ")}</h2>
                <Badge variant={getRoleVariant(role)} className="rounded-lg">
                  {rolePermissions.length} permissions
                </Badge>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                    <tr>
                      <th className="pb-3 font-medium">Resource</th>
                      <th className="pb-3 font-medium">Action</th>
                      <th className="pb-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {rolePermissions.map((permission) => (
                      <tr key={permission.id}>
                        <td className="py-3 font-medium text-[var(--color-foreground)]">{permission.resource}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="rounded-lg">
                            {permission.action}
                          </Badge>
                        </td>
                        <td className="py-3 text-[var(--color-muted-foreground)]">{permission.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No permissions defined"
          description="Role-based access entries will appear here once governance rules are registered for administrative and customer scopes."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
