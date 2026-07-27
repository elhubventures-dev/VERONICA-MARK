import "server-only";

import { Resend } from "resend";

import { renderEmail } from "@/emails";
import type { EmailTemplateKey, EmailVarsMap, RenderedEmail } from "@/emails/types";
import { logger } from "@/lib/logger";

export type SendEmailResult =
  | { ok: true; id?: string; skipped?: "missing_api_key" | "development_log" }
  | { ok: false; error: unknown };

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "VERONICA MARK <onboarding@resend.dev>";
}

/**
 * Send a pre-rendered email via Resend.
 * In development without RESEND_API_KEY, logs and returns skipped (does not throw).
 */
export async function dispatchEmail(input: {
  type: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Extra context for development logs (e.g. auth magic links). */
  debugUrl?: string;
}): Promise<SendEmailResult> {
  const resend = getResendClient();
  const to = input.to.trim().toLowerCase();

  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      logger.warn(
        {
          type: input.type,
          email: to,
          subject: input.subject,
          url: input.debugUrl,
        },
        "email.development_skip",
      );
      return { ok: true, skipped: "development_log" };
    }
    logger.error({ type: input.type, email: to }, "email.missing_resend_api_key");
    return { ok: true, skipped: "missing_api_key" };
  }

  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (result.error) {
    logger.error(
      { type: input.type, email: to, error: result.error },
      "email.send_failed",
    );
    return { ok: false, error: result.error };
  }

  logger.info({ type: input.type, email: to, id: result.data?.id }, "email.sent");
  return { ok: true, id: result.data?.id };
}

/**
 * Render a branded template and send it.
 * Never throws for transport failures — callers treating email as best-effort can ignore the result.
 */
export async function sendTemplateEmail<K extends EmailTemplateKey>(
  key: K,
  to: string,
  vars: EmailVarsMap[K],
  options?: { debugUrl?: string },
): Promise<SendEmailResult & { rendered?: RenderedEmail }> {
  const rendered = renderEmail(key, vars);
  const result = await dispatchEmail({
    type: key,
    to,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    debugUrl: options?.debugUrl,
  });
  return { ...result, rendered };
}
