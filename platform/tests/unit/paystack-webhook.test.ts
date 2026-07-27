import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack-signature";

describe("verifyPaystackWebhookSignature", () => {
  const secret = "sk_test_unit";

  it("accepts a valid HMAC-SHA512 signature", () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "vm_test" } });
    const signature = createHmac("sha512", secret).update(body).digest("hex");
    expect(verifyPaystackWebhookSignature(body, signature, secret)).toBe(true);
  });

  it("rejects a bad signature", () => {
    expect(verifyPaystackWebhookSignature("{}", "deadbeef", secret)).toBe(false);
    expect(verifyPaystackWebhookSignature("{}", null, secret)).toBe(false);
  });
});
