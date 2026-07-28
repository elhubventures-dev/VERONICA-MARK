import { describe, expect, it } from "vitest";

import { catalogCacheKey, CACHE_TAGS, CACHE_TTL } from "@/lib/performance/cache";
import { computeStorefrontTotals } from "@/lib/storefront/cart-totals";
import { organizationJsonLd, productJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
describe("production readiness helpers", () => {
  it("computes cart totals with tax and coupon discount", () => {
    const totals = computeStorefrontTotals({
      items: [{ quantity: 2, unitPrice: 100 }],
      taxRatePercent: 20,
      shippingFee: 12,
      couponDiscount: 20,
    });

    expect(totals.subtotal).toBe(200);
    expect(totals.discount).toBe(20);
    expect(totals.tax).toBe(36);
    expect(totals.shipping).toBe(12);
    expect(totals.total).toBe(228);
  });

  it("builds stable cache keys and tags", () => {
    expect(catalogCacheKey("products", "page-1")).toBe("vm:catalog:products:page-1");
    expect(CACHE_TAGS.products).toBe("catalog:products");
    expect(CACHE_TTL.catalogSeconds).toBeGreaterThan(0);
  });

  it("emits organization and website JSON-LD", () => {
    const org = organizationJsonLd();
    const site = websiteJsonLd();
    expect(org["@type"]).toBe("Organization");
    expect(site["@type"]).toBe("WebSite");
    expect(site.potentialAction?.["@type"]).toBe("SearchAction");
  });

  it("emits product JSON-LD for a catalog item", () => {
    const product = {
      id: "sample",
      slug: "sample-edp",
      name: "Sample Eau de Parfum",
      brand: "VMA SCENTS",
      brandSlug: "vma-scents",
      category: "Women",
      categorySlug: "women",
      price: 85000,
      image: "https://example.com/sample.jpg",
    };
    const json = productJsonLd(product);
    expect(json["@type"]).toBe("Product");
    expect(json.offers.price).toBe(product.price);
  });
});
