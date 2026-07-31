/**
 * Canonical August launch offer — edge-safe (middleware + UI + seed).
 * Keep dates / coupon here so middleware can rewrite `/` without pulling demo catalog.
 *
 * Authority clock: Africa/Lagos (West Africa Time / WAT, UTC+1, no DST).
 * The same UTC instant applies worldwide; UIs should format start/end in the
 * visitor’s local timezone so each person sees the window on their own clock.
 */

export const OPENING_COUPON_CODE = "VMA5AUG";
export const OPENING_DISCOUNT_PERCENT = 20;

/** IANA zone for the launch calendar — Nigerian / West Africa Time. */
export const FLASH_SALE_TIME_ZONE = "Africa/Lagos";

export const flashSale = {
  title: "Private Launch Page",
  description:
    "Shop 20% Off All Items with Code: VMA5AUG - Valid from 1st - 15th August 2026",
  /** Canonical August Grand Launch offer. */
  discountPercent: OPENING_DISCOUNT_PERCENT,
  /** Primary checkout coupon for the launch. */
  couponCode: OPENING_COUPON_CODE,
  /**
   * Africa/Lagos (WAT, UTC+1) — 1 Aug 00:00 through 15 Aug 23:59:59.
   * Parsed as absolute instants; display in each visitor’s local timezone.
   */
  startsAt: "2026-08-01T00:00:00+01:00",
  endsAt: "2026-08-15T23:59:59+01:00",
} as const;
