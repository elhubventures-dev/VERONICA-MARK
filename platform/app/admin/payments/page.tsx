import type { Metadata } from "next";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminPayments } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Payments",
  description: "Audit marketplace payment activity by provider, amount, and settlement state.",
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentStatusVariant(status: "succeeded" | "pending" | "failed" | "refunded") {
  switch (status) {
    case "succeeded":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "error";
    case "refunded":
    default:
      return "outline";
  }
}

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();
  const sortedPayments = [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Payments"
        description="Inspect transaction flow across providers, surface failures early, and review refund activity from one control surface."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/orders">View orders</Link>
          </Button>
        }
      />

      {sortedPayments.length ? (
        <section aria-label="Payment ledger" className="space-y-4">
          {sortedPayments.map((payment) => (
            <article
              key={payment.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{payment.orderNumber}</h2>
                    <Badge variant={getPaymentStatusVariant(payment.status)} className="rounded-lg capitalize">
                      {payment.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Provider:</span> {payment.provider}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Payment ID:</span> {payment.id}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Captured:</span>{" "}
                      {formatCreatedAt(payment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:min-w-56 xl:items-end">
                  <p className="font-display text-3xl text-[var(--color-foreground)]">
                    {formatPrice(payment.amount, payment.currency)}
                  </p>
                  <Button asChild>
                    <Link href={`/admin/orders/${payment.orderNumber}`}>Open order</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No payments recorded"
          description="Payment records will appear here as marketplace checkouts begin settling through configured providers."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
