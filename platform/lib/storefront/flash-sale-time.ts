import { flashSale } from "@/lib/storefront/flash-sale-config";

export type FlashSalePhase = "upcoming" | "live" | "ended";

export type FlashSaleRemaining = {
  phase: Exclude<FlashSalePhase, "ended">;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Before open → count to start; during sale → count to end; after close → null. */
export function getFlashSaleRemaining(now = Date.now()): FlashSaleRemaining | null {
  const startsAt = new Date(flashSale.startsAt).getTime();
  const endsAt = new Date(flashSale.endsAt).getTime();
  if (now > endsAt) return null;

  const target = now < startsAt ? startsAt : endsAt;
  const delta = target - now;
  if (delta <= 0) return null;

  return {
    phase: now < startsAt ? "upcoming" : "live",
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta / 3_600_000) % 24),
    minutes: Math.floor((delta / 60_000) % 60),
    seconds: Math.floor((delta / 1000) % 60),
  };
}

/**
 * Phase against the canonical WAT (Africa/Lagos) window — same UTC instant worldwide.
 * `now` should be wall-clock epoch ms (e.g. Date.now()); do not invent per-locale calendars.
 */
export function getFlashSalePhase(now = Date.now()): FlashSalePhase {
  const startsAt = new Date(flashSale.startsAt).getTime();
  const endsAt = new Date(flashSale.endsAt).getTime();
  if (now < startsAt) return "upcoming";
  if (now > endsAt) return "ended";
  return "live";
}

/**
 * Format a launch instant in the visitor’s local timezone (omit `timeZone`),
 * or pass `Africa/Lagos` when you need an explicit WAT label.
 */
export function formatFlashSaleInstant(
  iso: string,
  options?: {
    timeZone?: string;
    dateStyle?: "medium" | "long";
    timeStyle?: "short" | "medium";
  },
): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: options?.dateStyle ?? "medium",
    timeStyle: options?.timeStyle ?? "short",
    ...(options?.timeZone ? { timeZone: options.timeZone } : {}),
  }).format(new Date(iso));
}

/** Local-clock range for the launch window (browser timezone when `timeZone` omitted). */
export function formatFlashSaleWindowLocal(timeZone?: string): string {
  const start = formatFlashSaleInstant(flashSale.startsAt, { timeZone });
  const end = formatFlashSaleInstant(flashSale.endsAt, { timeZone });
  return `${start} – ${end}`;
}
