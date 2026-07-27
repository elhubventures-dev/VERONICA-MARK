import type { Metadata } from "next";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "See marketplace-wide order flow with payment and shipping states across every brand.",
};

function formatPlacedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderStatusVariant(status: string) {
  switch (status) {
    case "paid":
    case "shipped":
      return "success";
    case "processing":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(status: "paid" | "pending" | "failed" | "refunded") {
  switch (status) {
    case "paid":
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

function getShippingStatusVariant(status: "unfulfilled" | "packed" | "shipped" | "delivered") {
  switch (status) {
    case "delivered":
      return "success";
    case "packed":
    case "shipped":
      return "accent";
    case "unfulfilled":
    default:
      return "outline";
  }
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  const sortedOrders = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Orders"
        description="Track every marketplace order from checkout through fulfillment, with fast access to payment and shipment readiness."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/payments">View payments</Link>
          </Button>
        }
      />

      {sortedOrders.length ? (
        <section aria-label="Marketplace orders" className="space-y-4">
          {sortedOrders.map((order) => (
            <article
              key={order.orderNumber}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="font-display text-2xl text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                    >
                      {order.orderNumber}
                    </Link>
                    <Badge variant={getOrderStatusVariant(order.status)} className="rounded-lg capitalize">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Customer:</span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Brand:</span> {order.brandName}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Placed:</span>{" "}
                      {formatPlacedAt(order.placedAt)}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Total:</span>{" "}
                      {formatPrice(order.total, order.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:min-w-72 xl:items-end">
                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <Badge
                      variant={getPaymentStatusVariant(order.paymentStatus)}
                      className="rounded-lg capitalize"
                    >
                      Payment {order.paymentStatus}
                    </Badge>
                    <Badge
                      variant={getShippingStatusVariant(order.shippingStatus)}
                      className="rounded-lg capitalize"
                    >
                      Shipping {order.shippingStatus.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  <Button asChild>
                    <Link href={`/admin/orders/${order.orderNumber}`}>Open order</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No marketplace orders yet"
          description="Orders will populate here once shoppers begin transacting across the VERONICA MARK marketplace."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
