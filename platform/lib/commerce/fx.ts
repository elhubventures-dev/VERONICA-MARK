/**
 * Fixed storefront FX for international browsing.
 * Client rate: $1 = ₦1,500 (display only; catalog persists in NGN).
 */

export const USD_NGN_RATE = 1_500;

export type StoreCurrency = "NGN" | "USD";

export function ngnToUsd(amountNgn: number, rate: number = USD_NGN_RATE): number {
  if (!Number.isFinite(amountNgn) || rate <= 0) return 0;
  return Math.round((amountNgn / rate) * 100) / 100;
}

export function usdToNgn(amountUsd: number, rate: number = USD_NGN_RATE): number {
  if (!Number.isFinite(amountUsd) || rate <= 0) return 0;
  return Math.round(amountUsd * rate * 100) / 100;
}

/**
 * Convert a catalog (NGN) amount into the visitor display currency.
 */
export function convertCatalogAmount(
  amountNgn: number,
  displayCurrency: StoreCurrency,
  rate: number = USD_NGN_RATE,
): number {
  return displayCurrency === "USD" ? ngnToUsd(amountNgn, rate) : amountNgn;
}
