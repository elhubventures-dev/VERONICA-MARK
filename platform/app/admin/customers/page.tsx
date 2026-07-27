import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminCustomers } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Customers",
  description: "Review marketplace customers, monitor account health, and surface elevated fraud risk.",
};

function formatJoinedAt(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCustomerStatusVariant(status: "active" | "restricted" | "deleted") {
  switch (status) {
    case "active":
      return "success";
    case "restricted":
      return "warning";
    case "deleted":
    default:
      return "outline";
  }
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();
  const sortedCustomers = [...customers].sort((a, b) => b.spend - a.spend);
  const elevatedRiskCount = customers.filter((customer) => customer.riskScore >= 70).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Customers"
        description="Track customer quality across the marketplace, compare spend and orders, and escalate suspicious accounts before they become operational incidents."
      />

      <section aria-label="Customer overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Customers</p>
          <p className="mt-2 font-display text-3xl">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Restricted</p>
          <p className="mt-2 font-display text-3xl">
            {customers.filter((customer) => customer.status === "restricted").length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">High risk</p>
          <p className="mt-2 font-display text-3xl">{elevatedRiskCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">GMV represented</p>
          <p className="mt-2 font-display text-3xl">
            {formatPrice(customers.reduce((sum, customer) => sum + customer.spend, 0), "EUR")}
          </p>
        </div>
      </section>

      {sortedCustomers.length ? (
        <section aria-label="Customer directory" className="space-y-4">
          {sortedCustomers.map((customer) => {
            const isHighRisk = customer.riskScore >= 70;

            return (
              <article
                key={customer.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl text-[var(--color-foreground)]">{customer.name}</h2>
                      <Badge variant={getCustomerStatusVariant(customer.status)} className="rounded-lg capitalize">
                        {customer.status}
                      </Badge>
                      {isHighRisk ? (
                        <Badge variant="error" className="rounded-lg">
                          Risk {customer.riskScore}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Email:</span> {customer.email}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Country:</span> {customer.country}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Joined:</span>{" "}
                        {formatJoinedAt(customer.joinedAt)}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Orders:</span> {customer.orders}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:w-72 xl:grid-cols-1">
                    <div
                      className={`rounded-xl border px-4 py-3 ${
                        isHighRisk
                          ? "border-[var(--color-warning)] bg-[var(--color-warning)]/10"
                          : "border-[var(--color-border)] bg-[var(--color-muted)]/20"
                      }`}
                    >
                      <p className="text-sm text-[var(--color-muted-foreground)]">Risk score</p>
                      <p className="mt-1 font-display text-2xl">{customer.riskScore}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 px-4 py-3">
                      <p className="text-sm text-[var(--color-muted-foreground)]">Lifetime spend</p>
                      <p className="mt-1 font-display text-2xl">{formatPrice(customer.spend, "EUR")}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <AdminEmptyState
          title="No customers yet"
          description="Customer accounts will appear here once orders and registrations begin flowing through the marketplace."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
