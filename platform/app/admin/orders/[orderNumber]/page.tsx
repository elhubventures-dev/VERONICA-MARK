import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminOrder } from "@/lib/admin/queries";

type AdminOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Admin Order ${orderNumber}`,
    description: `Review marketplace order ${orderNumber}, including payment and shipping statuses.`,
  };
}

function formatPlacedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(status: string) {
  switch (status) {
    case "paid":
    case "succeeded":
    case "delivered":
      return "success";
    case "processing":
    case "pending":
    case "packed":
    case "shipped":
      return "accent";
    case "failed":
    case "cancelled":
      return "error";
    case "refunded":
    case "unfulfilled":
    default:
      return "outline";
  }
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getAdminOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatPlacedAt(order.placedAt)} by ${order.customerName} for ${order.brandName}.`}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to orders</Link>
          </Button>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_24rem]">
        <div className="space-y-4">
          <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted-foreground)]">Order total</p>
                <p className="mt-1 font-display text-3xl">{formatPrice(order.total, order.currency)}</p>
              </div>
              <Badge variant={getStatusVariant(order.status)} className="rounded-lg capitalize">
                {order.status}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">Customer</p>
                <p className="mt-1 font-medium text-[var(--color-foreground)]">{order.customerName}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">Brand</p>
                <p className="mt-1 font-medium text-[var(--color-foreground)]">{order.brandName}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">Payment status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(order.paymentStatus)} className="rounded-lg capitalize">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">Shipping status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(order.shippingStatus)} className="rounded-lg capitalize">
                    {order.shippingStatus.replaceAll("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-2xl">Operational summary</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <dt className="text-[var(--color-muted-foreground)]">Order number</dt>
                <dd className="mt-1 font-medium text-[var(--color-foreground)]">{order.orderNumber}</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <dt className="text-[var(--color-muted-foreground)]">Placed at</dt>
                <dd className="mt-1 font-medium text-[var(--color-foreground)]">{formatPlacedAt(order.placedAt)}</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <dt className="text-[var(--color-muted-foreground)]">Currency</dt>
                <dd className="mt-1 font-medium text-[var(--color-foreground)]">{order.currency}</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <dt className="text-[var(--color-muted-foreground)]">Marketplace scope</dt>
                <dd className="mt-1 font-medium text-[var(--color-foreground)]">Super admin cross-brand access</dd>
              </div>
            </dl>
          </article>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-2xl">Admin actions</h2>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Use demo controls to simulate exceptional support workflows without changing live data.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <AdminDemoButton
                label="Refund payment"
                message={`Refund triggered for ${order.orderNumber} in demo mode.`}
                variant="destructive"
              />
              <AdminDemoButton
                label="Force ship order"
                message={`Force-ship workflow triggered for ${order.orderNumber} in demo mode.`}
                variant="default"
              />
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
