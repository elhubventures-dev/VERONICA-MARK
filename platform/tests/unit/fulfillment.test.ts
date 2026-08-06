import { describe, expect, it } from "vitest";

import {
  buildStorePickupAddress,
  fulfillmentFromQuery,
  fulfillmentToQuery,
  STORE_PICKUP_LOCATION,
} from "@/lib/commerce/fulfillment";

describe("fulfillment", () => {
  it("parses checkout query values", () => {
    expect(fulfillmentFromQuery("pickup")).toBe("store_pickup");
    expect(fulfillmentFromQuery("store_pickup")).toBe("store_pickup");
    expect(fulfillmentFromQuery("delivery")).toBe("delivery");
    expect(fulfillmentFromQuery("other")).toBeNull();
  });

  it("maps modes back to query values", () => {
    expect(fulfillmentToQuery("store_pickup")).toBe("pickup");
    expect(fulfillmentToQuery("delivery")).toBe("delivery");
  });

  it("builds Port Harcourt store pickup address from contact fields", () => {
    const address = buildStorePickupAddress({
      name: "Ada Obi",
      email: "ada@example.com",
      phone: "+2348012345678",
    });
    expect(address).toMatchObject({
      name: "Ada Obi",
      email: "ada@example.com",
      phone: "+2348012345678",
      city: STORE_PICKUP_LOCATION.city,
      state: "Rivers",
      country: "NG",
      line1: STORE_PICKUP_LOCATION.line1,
    });
  });
});
