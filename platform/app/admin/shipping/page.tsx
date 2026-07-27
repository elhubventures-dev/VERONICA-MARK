import type { Metadata } from "next";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminShipments } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Shipping",
  description: "Track shipment movement, carrier health, and delivery exceptions across the marketplace.",
};

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getShipmentStatusVariant(
  status: "label_created" | "in_transit" | "out_for_delivery" | "delivered" | "exception",
) {
  switch (status) {
    case "delivered":
      return "success";
    case "in_transit":
    case "out_for_delivery":
      return "accent";
    case "exception":
      return "error";
    case "label_created":
    default:
      return "outline";
  }
}

export default async function AdminShippingPage() {
  const shipments = await getAdminShipments();
  const sortedShipments = [...shipments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Shipping"
        description="Monitor carrier progress, inspect tracking references, and quickly identify orders drifting toward exceptions."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/orders">View orders</Link>
          </Button>
        }
      />

      {sortedShipments.length ? (
        <section aria-label="Shipment ledger" className="space-y-4">
          {sortedShipments.map((shipment) => (
            <article
              key={shipment.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{shipment.orderNumber}</h2>
                    <Badge variant={getShipmentStatusVariant(shipment.status)} className="rounded-lg capitalize">
                      {shipment.status.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Carrier:</span> {shipment.carrier}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Tracking:</span>{" "}
                      {shipment.trackingNumber}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Destination:</span>{" "}
                      {shipment.destination}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Updated:</span>{" "}
                      {formatUpdatedAt(shipment.updatedAt)}
                    </p>
                  </div>
                </div>

                <Button asChild>
                  <Link href={`/admin/orders/${shipment.orderNumber}`}>Open order</Link>
                </Button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No shipments available"
          description="Shipping records will appear here once orders move into fulfillment and carrier labels start getting created."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
