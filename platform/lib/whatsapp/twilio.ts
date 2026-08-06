import "server-only";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type TwilioSendResult =
  | { ok: true; messageId?: string; skipped?: "missing_config" | "development_log" }
  | { ok: false; error: unknown };

const SEND_TIMEOUT_MS = 12_000;

export function getTwilioWhatsAppConfig(): {
  accountSid: string;
  authToken: string;
  from: string;
} | null {
  const accountSid = env.server.TWILIO_ACCOUNT_SID?.trim();
  const authToken = env.server.TWILIO_AUTH_TOKEN?.trim();
  const from = env.server.TWILIO_WHATSAPP_FROM?.trim();
  if (!accountSid || !authToken || !from) return null;
  return { accountSid, authToken, from };
}

/** Digits-only international → Twilio WhatsApp address (`whatsapp:+234…`). */
export function toTwilioWhatsAppAddress(phoneDigits: string): string {
  const digits = phoneDigits.replace(/\D/g, "");
  return `whatsapp:+${digits}`;
}

function normalizeFromAddress(from: string): string {
  const trimmed = from.trim();
  if (trimmed.toLowerCase().startsWith("whatsapp:")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return `whatsapp:+${digits}`;
}

/**
 * Send an approved WhatsApp Content template via Twilio Messages API.
 * Never throws.
 *
 * @see https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates
 */
export async function sendTwilioWhatsAppTemplate(input: {
  phoneNumber: string;
  contentSid: string;
  variables: Record<string, string>;
  context?: Record<string, unknown>;
}): Promise<TwilioSendResult> {
  const config = getTwilioWhatsAppConfig();
  if (!config) {
    if (env.server.NODE_ENV === "development") {
      logger.warn(
        {
          phone: input.phoneNumber,
          contentSid: input.contentSid,
          variables: input.variables,
          ...input.context,
        },
        "order.whatsapp.development_skip",
      );
      return { ok: true, skipped: "development_log" };
    }
    logger.warn({ ...input.context }, "order.whatsapp.missing_config");
    return { ok: true, skipped: "missing_config" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: toTwilioWhatsAppAddress(input.phoneNumber),
    From: normalizeFromAddress(config.from),
    ContentSid: input.contentSid,
    ContentVariables: JSON.stringify(input.variables),
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  const basic = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: controller.signal,
    });

    const bodyText = await response.text();
    let parsed: unknown = null;
    try {
      parsed = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      parsed = bodyText;
    }

    if (!response.ok) {
      logger.error(
        {
          status: response.status,
          body: parsed,
          phone: input.phoneNumber,
          contentSid: input.contentSid,
          ...input.context,
        },
        "order.whatsapp.send_failed",
      );
      return { ok: false, error: parsed ?? `HTTP ${response.status}` };
    }

    const messageId =
      parsed &&
      typeof parsed === "object" &&
      "sid" in parsed &&
      typeof (parsed as { sid: unknown }).sid === "string"
        ? (parsed as { sid: string }).sid
        : undefined;

    logger.info(
      {
        messageId,
        phone: input.phoneNumber,
        contentSid: input.contentSid,
        ...input.context,
      },
      "order.whatsapp.send_ok",
    );
    return { ok: true, messageId };
  } catch (error) {
    logger.error(
      {
        err: error,
        phone: input.phoneNumber,
        contentSid: input.contentSid,
        ...input.context,
      },
      "order.whatsapp.send_failed",
    );
    return { ok: false, error };
  } finally {
    clearTimeout(timer);
  }
}
