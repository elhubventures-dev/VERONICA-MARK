import { describe, expect, it } from "vitest";

import {
  ABANDONED_CART_IDLE_HOURS,
  ABANDONED_CART_SECOND_REMINDER_HOURS,
  parseSyncCartLines,
} from "@/lib/marketing/abandoned-cart-shared";

describe("abandoned cart helpers", () => {
  it("exposes recovery timing constants", () => {
    expect(ABANDONED_CART_IDLE_HOURS).toBe(1);
    expect(ABANDONED_CART_SECOND_REMINDER_HOURS).toBe(23);
  });

  it("parses valid cart sync lines", () => {
    const lines = parseSyncCartLines([
      { variantId: "variant-1", quantity: 2, unitPrice: 45000 },
      { variantId: "variant-2", quantity: 1, unitPrice: 12000 },
    ]);
    expect(lines).toHaveLength(2);
    expect(lines[0]?.quantity).toBe(2);
  });

  it("rejects invalid cart sync payloads", () => {
    expect(() => parseSyncCartLines([{ variantId: "", quantity: 1, unitPrice: 10 }])).toThrow();
    expect(() =>
      parseSyncCartLines([{ variantId: "x", quantity: 0, unitPrice: 10 }]),
    ).toThrow();
  });
});
