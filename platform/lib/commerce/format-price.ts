/** Server-safe currency formatting (major units). */
export function formatPrice(amount: number, currency: string): string {
  const locale = currency === "NGN" ? "en-NG" : currency === "USD" ? "en-US" : "en-GB";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
