import { describe, expect, it } from "vitest";

import {
  buildTrackingTimeline,
  normalizeOrderReference,
  normalizeTrackingEmail,
  orderEmailMatches,
} from "@/lib/commerce/order-tracking";

describe("order tracking helpers", () => {
  it("normalizes order reference and email", () => {
    expect(normalizeOrderReference("  vm-abc-123  ")).toBe("VM-ABC-123");
    expect(normalizeTrackingEmail("  Guest@Example.COM ")).toBe("guest@example.com");
  });

  it("matches customer or shipping email", () => {
    expect(orderEmailMatches("a@b.com", "a@b.com", {})).toBe(true);
    expect(orderEmailMatches("ship@b.com", "other@b.com", { email: "ship@b.com" })).toBe(true);
    expect(orderEmailMatches("wrong@b.com", "a@b.com", { email: "ship@b.com" })).toBe(false);
  });

  it("builds a fulfillment timeline with current step", () => {
    const placedAt = new Date("2026-07-22T09:14:00+01:00");
    const events = buildTrackingTimeline(
      "SHIPPED",
      [
        { toStatus: "PAID", createdAt: placedAt },
        { toStatus: "PROCESSING", createdAt: new Date("2026-07-22T12:00:00+01:00") },
        { toStatus: "SHIPPED", createdAt: new Date("2026-07-23T11:02:00+01:00") },
      ],
      placedAt,
    );

    expect(events).toHaveLength(6);
    expect(events[0]?.status).toBe("complete");
    expect(events[3]?.id).toBe("shipped");
    expect(events[3]?.status).toBe("current");
    expect(events[4]?.status).toBe("upcoming");
  });

  it("handles cancelled orders", () => {
    const placedAt = new Date("2026-07-22T09:14:00+01:00");
    const events = buildTrackingTimeline(
      "CANCELLED",
      [{ toStatus: "CANCELLED", createdAt: new Date("2026-07-22T10:00:00+01:00") }],
      placedAt,
    );
    expect(events).toHaveLength(2);
    expect(events[1]?.title).toBe("Order cancelled");
    expect(events[1]?.status).toBe("current");
  });
});
