import type { Currency } from "@prisma/client";

import type { DetailRow, OrderEmailVars, OrderLineVar } from "@/emails/types";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";
import { absoluteUrl } from "@/lib/seo/metadata";

type ShippingAddressJson = {
  name?: string;
  email?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

const SHIPPING_METHOD_LABELS: Record<string, string> = {
  intra_city: "Intra-city drop · Rivers / Abuja-FCT",
  interstate: "Interstate shipping",
  express: "Express courier",
  international: "International shipping",
};

function asShippingAddress(value: unknown): ShippingAddressJson {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as ShippingAddressJson;
}

export function formatOrderMoney(amount: number | string, currency: Currency | string = "NGN"): string {
  const n = typeof amount === "number" ? amount : Number(amount);
  const safe = Number.isFinite(n) ? n : 0;
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(safe);
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(safe);
}

function parseShippingMethod(notes: string | null | undefined): string | undefined {
  if (!notes) return undefined;
  const match = notes.match(/SHIPPING_METHOD:([a-z_]+)/i);
  if (!match?.[1]) return undefined;
  return SHIPPING_METHOD_LABELS[match[1]] ?? match[1];
}

function formatAddress(address: ShippingAddressJson): string | undefined {
  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(", "),
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

export function resolveOrderRecipient(order: OrderWithRelations): {
  email: string | null;
  name?: string;
} {
  const shipping = asShippingAddress(order.shippingAddress);
  const email =
    order.customer?.user?.email?.trim().toLowerCase() ||
    shipping.email?.trim().toLowerCase() ||
    null;
  const name =
    [order.customer?.user?.firstName, order.customer?.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    shipping.name?.trim() ||
    undefined;
  return { email, name };
}

export function buildOrderLineItems(order: OrderWithRelations): OrderLineVar[] {
  return order.items.map((item) => ({
    name: item.variantName ? `${item.productName} · ${item.variantName}` : item.productName,
    quantity: item.quantity,
    priceLabel: formatOrderMoney(Number(item.unitPrice), order.currency),
  }));
}

export function buildOrderEmailVars(
  order: OrderWithRelations,
  extras: Partial<OrderEmailVars> = {},
): OrderEmailVars {
  const shipping = asShippingAddress(order.shippingAddress);
  const tracking = order.shipments?.[0];
  const recipient = resolveOrderRecipient(order);

  return {
    recipientName: recipient.name,
    appUrl: absoluteUrl("/").replace(/\/$/, ""),
    orderNumber: order.orderNumber,
    orderTotalLabel: formatOrderMoney(Number(order.total), order.currency),
    currencyNote: "All product prices include tax.",
    items: buildOrderLineItems(order),
    shippingAddress: formatAddress(shipping),
    shippingMethod: parseShippingMethod(order.notes),
    trackingNumber: tracking?.trackingNumber ?? undefined,
    trackingUrl: absoluteUrl("/track-order"),
    invoiceUrl: absoluteUrl(`/invoices/${order.orderNumber}`),
    ...extras,
  };
}

/** Full submitted checkout/order payload for the admin inbox copy. */
export function buildOrderAdminDetails(
  order: OrderWithRelations,
  extras: { statusLabel?: string; paymentNote?: string } = {},
): DetailRow[] {
  const shipping = asShippingAddress(order.shippingAddress);
  const recipient = resolveOrderRecipient(order);
  const payment = order.payments?.[0];

  const rows: DetailRow[] = [
    { label: "Order", value: order.orderNumber },
    { label: "Status", value: extras.statusLabel || order.status },
    { label: "Customer", value: recipient.name || "—" },
    { label: "Customer email", value: recipient.email || shipping.email || "—" },
    { label: "Subtotal", value: formatOrderMoney(Number(order.subtotal), order.currency) },
    { label: "Shipping fee", value: formatOrderMoney(Number(order.shippingFee), order.currency) },
    { label: "Discount", value: formatOrderMoney(Number(order.discount), order.currency) },
    { label: "Total", value: formatOrderMoney(Number(order.total), order.currency) },
    { label: "Currency", value: order.currency },
  ];

  const method = parseShippingMethod(order.notes);
  if (method) rows.push({ label: "Shipping method", value: method });
  if (shipping.name) rows.push({ label: "Ship to name", value: shipping.name });
  if (shipping.email) rows.push({ label: "Ship to email", value: shipping.email });
  if (shipping.phone) rows.push({ label: "Phone", value: shipping.phone });
  if (shipping.line1) rows.push({ label: "Address line 1", value: shipping.line1 });
  if (shipping.line2) rows.push({ label: "Address line 2", value: shipping.line2 });
  if (shipping.city) rows.push({ label: "City", value: shipping.city });
  if (shipping.state) rows.push({ label: "State", value: shipping.state });
  if (shipping.postalCode) rows.push({ label: "Postal code", value: shipping.postalCode });
  if (shipping.country) rows.push({ label: "Country", value: shipping.country });

  const tracking = order.shipments?.[0];
  if (tracking?.trackingNumber) {
    rows.push({ label: "Tracking", value: tracking.trackingNumber });
  }
  if (payment?.reference) {
    rows.push({ label: "Payment reference", value: payment.reference });
  }
  if (payment?.status) {
    rows.push({ label: "Payment status", value: payment.status });
  }
  if (extras.paymentNote) {
    rows.push({ label: "Note", value: extras.paymentNote });
  }

  return rows;
}
