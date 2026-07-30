/**
 * Client shipping rates (VERONICA MARK, Jul 2026).
 * Domestic fees are NGN. International is USD $50 and only offered outside Nigeria.
 * Fulfillment hubs: Port Harcourt (Rivers) and Abuja-FCT.
 */

export const SHIPPING_METHOD_IDS = [
  "intra_city",
  "interstate",
  "express",
  "international",
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHOD_IDS)[number];

export type ShippingQuote = {
  methodId: ShippingMethodId;
  label: string;
  description: string;
  /** Fee in the quote currency's major units. */
  fee: number;
  currency: "NGN" | "USD";
  estimatedDelivery: string;
};

/** Fulfillment hubs eligible for intra-city drop. */
export const FULFILLMENT_HUBS = [
  { state: "Rivers", city: "Port Harcourt" },
  { state: "FCT", city: "Abuja-FCT" },
] as const;

/** @deprecated Prefer FULFILLMENT_HUBS — primary hub remains Port Harcourt. */
export const FULFILLMENT_STATE = FULFILLMENT_HUBS[0].state;
/** @deprecated Prefer FULFILLMENT_HUBS. */
export const FULFILLMENT_CITY = FULFILLMENT_HUBS[0].city;

export const DOMESTIC_SHIPPING_RATES = {
  intra_city: {
    methodId: "intra_city" as const,
    label: "Intra-city drop",
    description: "Same-city delivery within Rivers (Port Harcourt) or Abuja-FCT",
    fee: 3_500,
    currency: "NGN" as const,
    estimatedDelivery: "1–2 business days",
  },
  interstate: {
    methodId: "interstate" as const,
    label: "Interstate shipping",
    description: "Delivery to other Nigerian states",
    fee: 8_000,
    currency: "NGN" as const,
    estimatedDelivery: "3–5 business days",
  },
  express: {
    methodId: "express" as const,
    label: "Express courier",
    description: "Priority courier within Nigeria",
    fee: 10_000,
    currency: "NGN" as const,
    estimatedDelivery: "1–2 business days",
  },
} satisfies Record<Exclude<ShippingMethodId, "international">, ShippingQuote>;

export const INTERNATIONAL_SHIPPING_RATE: ShippingQuote = {
  methodId: "international",
  label: "International shipping",
  description: "Worldwide courier outside Nigeria",
  fee: 50,
  currency: "USD",
  estimatedDelivery: "5–10 business days",
};

/** Nigerian states — used at checkout to choose intra-city vs interstate. */
export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export function isNigeriaCountry(country: string | null | undefined): boolean {
  const normalized = (country ?? "").trim().toUpperCase();
  return normalized === "NG" || normalized === "NGA" || normalized === "NIGERIA";
}

/** True when destination is a fulfillment hub (Rivers / Port Harcourt or Abuja-FCT). */
export function isFulfillmentState(state: string | null | undefined): boolean {
  const normalized = (state ?? "").trim().toLowerCase();
  return (
    normalized === "rivers" ||
    normalized === "rv" ||
    normalized === "port harcourt" ||
    normalized === "portharcourt" ||
    normalized === "fct" ||
    normalized === "abuja" ||
    normalized === "abuja-fct" ||
    normalized === "abuja fct" ||
    normalized === "federal capital territory" ||
    normalized === "fct abuja"
  );
}

/** @deprecated Use isFulfillmentState — hubs are Rivers and FCT, not Lagos. */
export function isLagosState(state: string | null | undefined): boolean {
  return isFulfillmentState(state);
}

export function isShippingMethodId(value: string): value is ShippingMethodId {
  return (SHIPPING_METHOD_IDS as readonly string[]).includes(value);
}

/**
 * Methods offered for a destination.
 * Outside Nigeria → international only (USD).
 * Rivers or FCT → intra-city + express (no interstate).
 * Other Nigerian states → interstate + express (no intra-city).
 */
export function getAvailableShippingMethods(input: {
  country: string;
  state?: string;
}): ShippingQuote[] {
  if (!isNigeriaCountry(input.country)) {
    return [INTERNATIONAL_SHIPPING_RATE];
  }

  if (isFulfillmentState(input.state)) {
    return [DOMESTIC_SHIPPING_RATES.intra_city, DOMESTIC_SHIPPING_RATES.express];
  }

  return [DOMESTIC_SHIPPING_RATES.interstate, DOMESTIC_SHIPPING_RATES.express];
}

export function defaultShippingMethodId(input: {
  country: string;
  state?: string;
}): ShippingMethodId {
  if (!isNigeriaCountry(input.country)) {
    return "international";
  }
  return isFulfillmentState(input.state) ? "intra_city" : "interstate";
}

export function quoteShipping(input: {
  country: string;
  state?: string;
  methodId: ShippingMethodId;
}): ShippingQuote {
  const available = getAvailableShippingMethods(input);
  const match = available.find((method) => method.methodId === input.methodId);
  if (match) {
    return match;
  }

  const fallbackId = defaultShippingMethodId(input);
  const fallback = available.find((method) => method.methodId === fallbackId);
  if (!fallback) {
    throw new Error("No shipping methods available for destination");
  }
  return fallback;
}

import { USD_NGN_RATE } from "@/lib/commerce/fx";

/**
 * Convert international USD shipping into NGN for Paystack / order persistence.
 * Fixed client rate: $1 = ₦1,500 unless `usdToNgnRate` / env overrides.
 */
export function internationalShippingFeeNgn(usdToNgnRate?: number): number {
  const rate =
    usdToNgnRate ??
    (typeof process !== "undefined" && process.env.USD_NGN_RATE
      ? Number(process.env.USD_NGN_RATE)
      : Number.NaN);

  const resolved = Number.isFinite(rate) && rate > 0 ? rate : USD_NGN_RATE;
  return Math.round(INTERNATIONAL_SHIPPING_RATE.fee * resolved * 100) / 100;
}

/** Fee in NGN for order totals / Paystack (international converted). */
export function shippingFeeNgn(input: {
  country: string;
  state?: string;
  methodId: ShippingMethodId;
  usdToNgnRate?: number;
}): number {
  const quote = quoteShipping(input);
  if (quote.currency === "USD") {
    return internationalShippingFeeNgn(input.usdToNgnRate);
  }
  return quote.fee;
}
