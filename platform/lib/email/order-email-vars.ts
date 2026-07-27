import type { Currency } from "@prisma/client";

import type { OrderEmailVars, OrderLineVar } from "@/emails/types";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";
import { absoluteUrl } from "@/lib/seo/metadata";

type ShippingAddressJson = {
  name?: string;
  email?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

const SHIPPING_METHOD_LABELS: Record<string, string> = {
  intra_city: "Intra-city drop · Rivers",
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

export function buildOrderEmailVars(
  order: OrderWithRelations,
  extras: Partial<OrderEmailVars> = {},
): OrderEmailVars {
  const shipping = asShippingAddress(order.shippingAddress);
  const tracking = order.shipments?.[0];
  const items: OrderLineVar[] = order.items.map((item) => ({
    name: item.variantName ? `${item.productName} · ${item.variantName}` : item.productName,
    quantity: item.quantity,
    priceLabel: formatOrderMoney(Number(item.unitPrice), order.currency),
  }));

  return {
    recipientName: resolveOrderRecipient(order).name,
    appUrl: absoluteUrl("/").replace(/\/$/, ""),
    orderNumber: order.orderNumber,
    orderTotalLabel: formatOrderMoney(Number(order.total), order.currency),
    currencyNote: "All product prices include tax.",
    items,
    shippingAddress: formatAddress(shipping),
    shippingMethod: parseShippingMethod(order.notes),
    trackingNumber: tracking?.trackingNumber ?? undefined,
    trackingUrl: absoluteUrl("/track-order"),
    invoiceUrl: absoluteUrl(`/invoices/${order.orderNumber}`),
    ...extras,
  };
}
