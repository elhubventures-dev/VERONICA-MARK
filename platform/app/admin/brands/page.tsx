import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminBrands } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Brands",
  description: "Review marketplace brands, track revenue, and manage onboarding status.",
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getBrandStatusVariant(status: "pending" | "active" | "suspended" | "archived") {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "error";
    case "archived":
    default:
      return "outline";
  }
}

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();
  const sortedBrands = [...brands].sort((a, b) => b.revenue30d - a.revenue30d);
  const totals = {
    active: brands.filter((brand) => brand.status === "active").length,
    pending: brands.filter((brand) => brand.status === "pending").length,
    suspended: brands.filter((brand) => brand.status === "suspended").length,
    revenue30d: brands.reduce((sum, brand) => sum + brand.revenue30d, 0),
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Brands"
        description="Monitor marketplace brand performance, approve onboarding requests, and intervene quickly when an account needs review."
      />

      <section aria-label="Brand overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Total brands</p>
          <p className="mt-2 font-display text-3xl">{brands.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Active</p>
          <p className="mt-2 font-display text-3xl">{totals.active}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Pending approval</p>
          <p className="mt-2 font-display text-3xl">{totals.pending}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Revenue (30d)</p>
          <p className="mt-2 font-display text-3xl">{formatPrice(totals.revenue30d, "EUR")}</p>
        </div>
      </section>

      {sortedBrands.length ? (
        <section aria-label="Brand directory" className="space-y-4">
          {sortedBrands.map((brand) => (
            <article
              key={brand.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{brand.name}</h2>
                    <Badge variant={getBrandStatusVariant(brand.status)} className="rounded-lg capitalize">
                      {brand.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Slug:</span> /{brand.slug}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Managers:</span> {brand.managers}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Products:</span> {brand.products}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Joined:</span>{" "}
                      {formatCreatedAt(brand.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 xl:items-end">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 px-4 py-3 xl:min-w-56">
                    <p className="text-sm text-[var(--color-muted-foreground)]">Revenue (30d)</p>
                    <p className="mt-1 font-display text-2xl">{formatPrice(brand.revenue30d, "EUR")}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {brand.status === "pending" ? (
                      <AdminDemoButton
                        label="Approve brand"
                        message={`${brand.name} approved in demo mode.`}
                        variant="default"
                      />
                    ) : null}
                    {brand.status !== "suspended" ? (
                      <AdminDemoButton
                        label="Suspend brand"
                        message={`${brand.name} suspended in demo mode.`}
                        variant="destructive"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No brands yet"
          description="Approved and pending marketplace brands will appear here as the super admin team expands the VERONICA MARK network."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
