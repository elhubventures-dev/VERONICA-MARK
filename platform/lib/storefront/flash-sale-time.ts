import { flashSale } from "@/lib/storefront/demo-catalog";

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

export function getFlashSalePhase(now = Date.now()): FlashSalePhase {
  const startsAt = new Date(flashSale.startsAt).getTime();
  const endsAt = new Date(flashSale.endsAt).getTime();
  if (now < startsAt) return "upcoming";
  if (now > endsAt) return "ended";
  return "live";
}
