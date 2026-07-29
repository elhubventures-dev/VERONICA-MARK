"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  OrderStatusBadge,
  type OrderStatus,
} from "@/components/commerce/order-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  updateAdminOrderDetailsAction,
  updateAdminOrderStatusAction,
} from "@/lib/admin/actions/orders";
import {
  updateBrandOrderDetailsAction,
  updateBrandOrderStatusAction,
} from "@/lib/brand/actions";
import type { OrderAddressFields } from "@/lib/commerce/order-address";
import {
  formatOrderStatusLabel,
  UI_ORDER_STATUSES,
} from "@/lib/commerce/order-status";

type OrderManagementPanelProps = {
  mode: "admin" | "brand";
  orderNumber: string;
  initialStatus: OrderStatus;
  initialNotes: string;
  initialShippingAddress: OrderAddressFields;
};

export function OrderManagementPanel({
  mode,
  orderNumber,
  initialStatus,
  initialNotes,
  initialShippingAddress,
}: OrderManagementPanelProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<OrderStatus>(initialStatus);
  const [statusNote, setStatusNote] = React.useState("");
  const [notes, setNotes] = React.useState(initialNotes);
  const [address, setAddress] = React.useState(initialShippingAddress);
  const [statusPending, setStatusPending] = React.useState(false);
  const [detailsPending, setDetailsPending] = React.useState(false);

  React.useEffect(() => {
    setStatus(initialStatus);
    setNotes(initialNotes);
    setAddress(initialShippingAddress);
  }, [initialStatus, initialNotes, initialShippingAddress]);

  function updateAddressField<K extends keyof OrderAddressFields>(
    key: K,
    value: OrderAddressFields[K],
  ) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  async function saveStatus() {
    setStatusPending(true);
    try {
      if (mode === "admin") {
        const result = await updateAdminOrderStatusAction({
          orderNumber,
          status,
          note: statusNote.trim() || undefined,
        });
        if (!result.success) {
          toast.error(result.error.message);
          return;
        }
        toast.success(`Order status updated to ${formatOrderStatusLabel(status)}.`);
      } else {
        const result = await updateBrandOrderStatusAction({
          orderNumber,
          status,
          note: statusNote.trim() || undefined,
        });
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
      }
      setStatusNote("");
      router.refresh();
    } finally {
      setStatusPending(false);
    }
  }

  async function saveDetails() {
    setDetailsPending(true);
    try {
      const payload = {
        orderNumber,
        notes,
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          email: address.email,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      };

      if (mode === "admin") {
        const result = await updateAdminOrderDetailsAction(payload);
        if (!result.success) {
          toast.error(result.error.message);
          return;
        }
        toast.success("Order details saved.");
      } else {
        const result = await updateBrandOrderDetailsAction(payload);
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
      }
      router.refresh();
    } finally {
      setDetailsPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Update status</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Change the order lifecycle status. Customers are emailed when a matching
              notification template exists.
            </p>
          </div>
          <OrderStatusBadge status={status} />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`order-status-${orderNumber}`}>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
              <SelectTrigger id={`order-status-${orderNumber}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {UI_ORDER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {formatOrderStatusLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`order-status-note-${orderNumber}`}>Internal note (optional)</Label>
            <Input
              id={`order-status-note-${orderNumber}`}
              value={statusNote}
              onChange={(event) => setStatusNote(event.target.value)}
              placeholder="Reason for this status change"
              maxLength={500}
            />
          </div>

          <Button
            type="button"
            disabled={statusPending || status === initialStatus}
            onClick={() => void saveStatus()}
          >
            {statusPending ? "Updating…" : "Save status"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-display text-xl">Edit order</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Update the shipping destination and staff notes for this order.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`ship-name-${orderNumber}`}>Recipient name</Label>
            <Input
              id={`ship-name-${orderNumber}`}
              value={address.name}
              onChange={(event) => updateAddressField("name", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-phone-${orderNumber}`}>Phone</Label>
            <Input
              id={`ship-phone-${orderNumber}`}
              value={address.phone}
              onChange={(event) => updateAddressField("phone", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-email-${orderNumber}`}>Email</Label>
            <Input
              id={`ship-email-${orderNumber}`}
              type="email"
              value={address.email}
              onChange={(event) => updateAddressField("email", event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`ship-line1-${orderNumber}`}>Address line 1</Label>
            <Input
              id={`ship-line1-${orderNumber}`}
              value={address.line1}
              onChange={(event) => updateAddressField("line1", event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`ship-line2-${orderNumber}`}>Address line 2</Label>
            <Input
              id={`ship-line2-${orderNumber}`}
              value={address.line2}
              onChange={(event) => updateAddressField("line2", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-city-${orderNumber}`}>City</Label>
            <Input
              id={`ship-city-${orderNumber}`}
              value={address.city}
              onChange={(event) => updateAddressField("city", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-state-${orderNumber}`}>State</Label>
            <Input
              id={`ship-state-${orderNumber}`}
              value={address.state}
              onChange={(event) => updateAddressField("state", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-postal-${orderNumber}`}>Postal code</Label>
            <Input
              id={`ship-postal-${orderNumber}`}
              value={address.postalCode}
              onChange={(event) => updateAddressField("postalCode", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ship-country-${orderNumber}`}>Country</Label>
            <Input
              id={`ship-country-${orderNumber}`}
              value={address.country}
              onChange={(event) => updateAddressField("country", event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`order-notes-${orderNumber}`}>Order notes</Label>
            <Textarea
              id={`order-notes-${orderNumber}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Delivery instructions or internal context"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button type="button" disabled={detailsPending} onClick={() => void saveDetails()}>
            {detailsPending ? "Saving…" : "Save order details"}
          </Button>
        </div>
      </section>
    </div>
  );
}
