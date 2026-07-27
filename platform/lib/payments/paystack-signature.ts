import { createHmac, timingSafeEqual } from "node:crypto";

/** Verify `x-paystack-signature` HMAC-SHA512 of the raw request body. */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(hash, "utf8");
    const b = Buffer.from(signatureHeader, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
