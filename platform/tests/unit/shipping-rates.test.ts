import { describe, expect, it } from "vitest";

import {
  defaultShippingMethodId,
  getAvailableShippingMethods,
  internationalShippingFeeNgn,
  quoteShipping,
  shippingFeeNgn,
} from "@/lib/commerce/shipping-rates";

describe("shipping rates", () => {
  it("offers intra-city + express in Rivers (no interstate)", () => {
    const methods = getAvailableShippingMethods({ country: "NG", state: "Rivers" });
    expect(methods.map((m) => m.methodId)).toEqual(["intra_city", "express"]);
    expect(methods.every((m) => m.currency === "NGN")).toBe(true);
  });

  it("offers interstate + express outside Rivers (no intra-city)", () => {
    const methods = getAvailableShippingMethods({ country: "NG", state: "Lagos" });
    expect(methods.map((m) => m.methodId)).toEqual(["interstate", "express"]);
  });

  it("offers only USD international shipping outside Nigeria", () => {
    const methods = getAvailableShippingMethods({ country: "US" });
    expect(methods).toHaveLength(1);
    expect(methods[0]).toMatchObject({
      methodId: "international",
      fee: 50,
      currency: "USD",
    });
  });

  it("defaults Rivers to intra-city and other states to interstate", () => {
    expect(defaultShippingMethodId({ country: "NG", state: "Rivers" })).toBe("intra_city");
    expect(defaultShippingMethodId({ country: "NG", state: "Kano" })).toBe("interstate");
    expect(defaultShippingMethodId({ country: "GB" })).toBe("international");
  });

  it("quotes fixed domestic fees", () => {
    expect(
      quoteShipping({ country: "NG", state: "Rivers", methodId: "intra_city" }).fee,
    ).toBe(3500);
    expect(
      quoteShipping({ country: "NG", state: "Kano", methodId: "interstate" }).fee,
    ).toBe(8000);
    expect(quoteShipping({ country: "NG", state: "Rivers", methodId: "express" }).fee).toBe(
      10_000,
    );
  });

  it("falls back when an unavailable method is requested for the state", () => {
    const interstateInRivers = quoteShipping({
      country: "NG",
      state: "Rivers",
      methodId: "interstate",
    });
    expect(interstateInRivers.methodId).toBe("intra_city");

    const intraOutsideRivers = quoteShipping({
      country: "NG",
      state: "Lagos",
      methodId: "intra_city",
    });
    expect(intraOutsideRivers.methodId).toBe("interstate");
  });

  it("rejects domestic method for international destination by falling back", () => {
    const quote = quoteShipping({ country: "FR", methodId: "express" });
    expect(quote.methodId).toBe("international");
    expect(quote.currency).toBe("USD");
  });

  it("converts international USD fee to NGN for Paystack at ₦1,500/$1", () => {
    expect(internationalShippingFeeNgn(1500)).toBe(75_000);
    expect(
      shippingFeeNgn({
        country: "US",
        methodId: "international",
        usdToNgnRate: 1500,
      }),
    ).toBe(75_000);
  });
});
