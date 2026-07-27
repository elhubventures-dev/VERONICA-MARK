import { isNigeriaCountry } from "@/lib/commerce/shipping-rates";
import type { StoreCurrency } from "@/lib/commerce/fx";

export const GEO_COUNTRY_COOKIE = "vm-geo-country";

/** Cookie max-age: 30 days */
export const GEO_COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Resolve ISO country from edge geo headers (Vercel / Cloudflare).
 */
export function resolveCountryFromHeaders(headers: Headers): string | null {
  const candidates = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
    headers.get("x-country-code"),
  ];

  for (const value of candidates) {
    const code = value?.trim().toUpperCase();
    if (code && code.length === 2 && code !== "XX" && code !== "T1") {
      return code;
    }
  }

  return null;
}

export function normalizeCountryCode(value: string | null | undefined): string {
  const code = (value ?? "").trim().toUpperCase();
  if (code.length === 2) return code;
  return "NG";
}

export function displayCurrencyForCountry(country: string): StoreCurrency {
  return isNigeriaCountry(country) ? "NGN" : "USD";
}

/** Countries offered in checkout `<select>` — fall back to US when geo is elsewhere. */
export const CHECKOUT_COUNTRY_OPTIONS = ["NG", "GH", "KE", "ZA", "GB", "US", "FR"] as const;

export function checkoutCountryFromGeo(geoCountry: string): string {
  const code = normalizeCountryCode(geoCountry);
  if ((CHECKOUT_COUNTRY_OPTIONS as readonly string[]).includes(code)) {
    return code;
  }
  return isNigeriaCountry(code) ? "NG" : "US";
}
