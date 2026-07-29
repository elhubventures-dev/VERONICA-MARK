import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderManagementPanel } from "@/components/commerce/order-management-panel";
import { StaffOrderOverview } from "@/components/commerce/staff-order-overview";
import { PageHeader } from "@/components/layout/page-header";
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
    description: `Review and edit marketplace order ${orderNumber}, including payment and shipping details.`,
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

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getAdminOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const brandLabel = order.brandNames.length ? order.brandNames.join(", ") : "marketplace brands";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatPlacedAt(order.placedAt)} by ${order.customerName} for ${brandLabel}.`}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to orders</Link>
          </Button>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,28rem)]">
        <StaffOrderOverview order={order} showBrandNames />
        <aside>
          <OrderManagementPanel
            mode="admin"
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
