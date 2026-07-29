import { describe, expect, it } from "vitest";

/**
 * Bank-transfer charges may include fees in `amount` while `requested_amount`
 * matches what we initialized. Matching must prefer requested_amount.
 */
function resolveMatchMinor(verified: {
  amountMinor: number;
  requestedAmountMinor: number | null;
}): number {
  return verified.requestedAmountMinor != null && Number.isFinite(verified.requestedAmountMinor)
    ? verified.requestedAmountMinor
    : verified.amountMinor;
}

describe("Paystack amount matching", () => {
  it("matches bank_transfer using requested_amount when fees inflate amount", () => {
    const expectedMinor = 890_000;
    const verified = {
      amountMinor: 913_706,
      requestedAmountMinor: 890_000,
    };
    expect(resolveMatchMinor(verified)).toBe(expectedMinor);
    expect(resolveMatchMinor(verified) === expectedMinor).toBe(true);
  });

  it("falls back to amount when requested_amount is absent", () => {
    expect(
      resolveMatchMinor({
        amountMinor: 890_000,
        requestedAmountMinor: null,
      }),
    ).toBe(890_000);
  });
});
