/**
 * Checkout fulfillment modes — delivery vs in-store pickup (Port Harcourt for now).
 */

import { storefrontContact } from "@/lib/storefront/contact";

export const FULFILLMENT_MODES = ["delivery", "store_pickup"] as const;
export type FulfillmentMode = (typeof FULFILLMENT_MODES)[number];

export const FULFILLMENT_STORAGE_KEY = "vm-fulfillment";
export const FULFILLMENT_QUERY_KEY = "fulfillment";

/** Port Harcourt pickup — Abuja can be added later. */
export const STORE_PICKUP_LOCATION = {
  id: "port_harcourt",
  label: "Port Harcourt store",
  city: "Port Harcourt",
  state: "Rivers",
  country: "NG",
  postalCode: "500001",
  line1: storefrontContact.address.line1,
  line2: storefrontContact.address.line2,
  addressLine: storefrontContact.addressLine,
  mapsUrl: storefrontContact.mapsUrl,
} as const;

export function isFulfillmentMode(value: string | null | undefined): value is FulfillmentMode {
  return value === "delivery" || value === "store_pickup";
}

/** Map URL query (`pickup` | `delivery`) to fulfillment mode. */
export function fulfillmentFromQuery(value: string | null | undefined): FulfillmentMode | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "pickup" || normalized === "store_pickup") return "store_pickup";
  if (normalized === "delivery") return "delivery";
  return null;
}

export function fulfillmentToQuery(mode: FulfillmentMode): "pickup" | "delivery" {
  return mode === "store_pickup" ? "pickup" : "delivery";
}

export function checkoutPathForFulfillment(mode: FulfillmentMode): string {
  return `/checkout?${FULFILLMENT_QUERY_KEY}=${fulfillmentToQuery(mode)}`;
}

export function buildStorePickupAddress(contact: {
  name: string;
  email: string;
  phone: string;
}) {
  return {
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    phone: contact.phone.trim(),
    line1: STORE_PICKUP_LOCATION.line1,
    line2: STORE_PICKUP_LOCATION.line2,
    city: STORE_PICKUP_LOCATION.city,
    state: STORE_PICKUP_LOCATION.state,
    postalCode: STORE_PICKUP_LOCATION.postalCode,
    country: STORE_PICKUP_LOCATION.country,
  };
}
