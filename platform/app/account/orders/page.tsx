import type { Metadata } from "next";
import Link from "next/link";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { OrderCard } from "@/components/commerce/order-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getAccountOrders } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Orders",
  description: "Review your VERONICA MARK order history and track every shipment.",
};

function formatPlacedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountOrdersPage() {
  const orders = await getAccountOrders();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Orders"
        description="Track every delivery, revisit past purchases, and open invoice-ready details in one place."
        actions={
          <Button asChild variant="outline">
            <Link href="/shop">Shop the edit</Link>
          </Button>
        }
      />

      {orders.length ? (
        <section aria-label="Orders list" className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.orderNumber}
              orderNumber={order.orderNumber}
              placedAt={formatPlacedAt(order.placedAt)}
              status={order.status}
              itemCount={order.items.reduce((count, item) => count + item.quantity, 0)}
              total={order.total}
              currency={order.currency}
              previews={order.items.map((item) => ({
                imageSrc: item.image,
                imageAlt: item.title,
              }))}
              href={`/account/orders/${order.orderNumber}`}
            />
          ))}
        </section>
      ) : (
        <AccountEmptyState
          title="No orders yet"
          description="Once you place your first VERONICA MARK order, it will appear here with tracking and invoice access."
          actionLabel="Start shopping"
          actionHref="/shop"
        />
      )}
    </div>
  );
}
