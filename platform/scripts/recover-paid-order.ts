/**
 * Recover a Paystack-success / DB-PENDING payment: finalize + send confirmation emails.
 * Usage: node --import tsx scripts/recover-paid-order.ts <paystack-reference>
 */
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  const k = line.slice(0, i).trim();
  if (!process.env[k]) process.env[k] = v;
}

async function main() {
  const reference = process.argv[2];
  if (!reference) {
    throw new Error("Usage: pnpm exec tsx scripts/recover-paid-order.ts <reference>");
  }

  const { finalizePaystackPayment } = await import("../lib/payments/checkout-paystack.service");
  const result = await finalizePaystackPayment(reference);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
