import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderFulfillmentActions } from "@/components/brand/order-fulfillment-actions";
import { OrderManagementPanel } from "@/components/commerce/order-management-panel";
import { StaffOrderOverview } from "@/components/commerce/staff-order-overview";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBrandOrder } from "@/lib/brand/queries";

type BrandOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: BrandOrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Brand Order ${orderNumber}`,
    description: `View, edit, and fulfill brand order ${orderNumber}.`,
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

export default async function BrandOrderDetailPage({
  params,
}: BrandOrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getBrandOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatPlacedAt(order.placedAt)} by ${order.customerName}.`}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/brand/orders">Back to orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/brand/customers">Customer list</Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,28rem)]">
        <StaffOrderOverview order={order} showBrandNames={false} />
        <aside className="space-y-4">
          <OrderFulfillmentActions orderNumber={order.orderNumber} initialStatus={order.status} />
          <OrderManagementPanel
            mode="brand"
            orderNumber={order.orderNumber}
            initialStatus={order.status}
            initialNotes={order.customerNotes}
            initialShippingAddress={order.shippingAddress}
          />
        </aside>
      </section>
    </div>
  );
}
