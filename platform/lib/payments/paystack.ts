import "server-only";

import { randomUUID } from "node:crypto";

import { env } from "@/lib/env";
import { AppError, ValidationError } from "@/lib/errors";
import { verifyPaystackWebhookSignature as verifySignature } from "@/lib/payments/paystack-signature";

const PAYSTACK_BASE = "https://api.paystack.co";

export type PaystackInitializeInput = {
  email: string;
  /** Amount in major units (e.g. 150.50 NGN) */
  amountMajor: number;
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES";
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type PaystackInitializeResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export type PaystackVerifyResult = {
  status: string;
  reference: string;
  amountMinor: number;
  currency: string;
  paidAt: string | null;
  channel: string | null;
  gatewayResponse: string | null;
  raw: Record<string, unknown>;
};

function requireSecret(): string {
  const key = env.server.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new AppError("Paystack is not configured. Set PAYSTACK_SECRET_KEY.", {
      code: "PAYSTACK_NOT_CONFIGURED",
      statusCode: 503,
    });
  }
  return key;
}

function toMinorUnits(amountMajor: number): number {
  if (!Number.isFinite(amountMajor) || amountMajor <= 0) {
    throw new ValidationError("Payment amount must be a positive number");
  }
  return Math.round(amountMajor * 100);
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const secret = requireSecret();
  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = (await response.json()) as {
    status: boolean;
    message: string;
    data?: T;
  };

  if (!response.ok || !body.status || body.data === undefined) {
    throw new AppError(body.message || "Paystack request failed", {
      code: "PAYSTACK_API_ERROR",
      statusCode: 502,
      details: { path, httpStatus: response.status },
    });
  }

  return body.data;
}

export function isPaystackConfigured(): boolean {
  return Boolean(env.server.PAYSTACK_SECRET_KEY);
}

export async function initializePaystackTransaction(
  input: PaystackInitializeInput,
): Promise<PaystackInitializeResult> {
  const currency = input.currency ?? "NGN";
  const data = await paystackFetch<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.toLowerCase(),
      amount: toMinorUnits(input.amountMajor),
      currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
  });

  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResult> {
  const data = await paystackFetch<Record<string, unknown>>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  return {
    status: String(data.status ?? ""),
    reference: String(data.reference ?? reference),
    amountMinor: Number(data.amount ?? 0),
    currency: String(data.currency ?? "NGN"),
    paidAt: data.paid_at ? String(data.paid_at) : null,
    channel: data.channel ? String(data.channel) : null,
    gatewayResponse: data.gateway_response ? String(data.gateway_response) : null,
    raw: data,
  };
}

/** Verify `x-paystack-signature` using the configured secret key. */
export function verifyPaystackWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  return verifySignature(rawBody, signatureHeader, requireSecret());
}

export function createPaystackReference(orderNumber: string): string {
  const suffix = randomUUID().replace(/-/g, "").slice(0, 12);
  return `vm_${orderNumber.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}_${suffix}`;
}
