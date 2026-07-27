import { describe, expect, it } from "vitest";

import { convertCatalogAmount, ngnToUsd, usdToNgn, USD_NGN_RATE } from "@/lib/commerce/fx";
import {
  checkoutCountryFromGeo,
  displayCurrencyForCountry,
  normalizeCountryCode,
} from "@/lib/commerce/geo";

describe("fx", () => {
  it("uses $1 = ₦1,500", () => {
    expect(USD_NGN_RATE).toBe(1500);
    expect(ngnToUsd(150_000)).toBe(100);
    expect(usdToNgn(50)).toBe(75_000);
    expect(convertCatalogAmount(75_000, "USD")).toBe(50);
    expect(convertCatalogAmount(75_000, "NGN")).toBe(75_000);
  });
});

describe("geo currency", () => {
  it("maps Nigeria to NGN and others to USD", () => {
    expect(displayCurrencyForCountry("NG")).toBe("NGN");
    expect(displayCurrencyForCountry("US")).toBe("USD");
    expect(displayCurrencyForCountry("GB")).toBe("USD");
  });

  it("normalizes checkout country from geo", () => {
    expect(normalizeCountryCode("us")).toBe("US");
    expect(checkoutCountryFromGeo("NG")).toBe("NG");
    expect(checkoutCountryFromGeo("US")).toBe("US");
    expect(checkoutCountryFromGeo("DE")).toBe("US");
  });
});
