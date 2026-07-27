import "server-only";

import { Resend } from "resend";

import { logger } from "@/lib/logger";

function buildAuthUrl(baseUrl: string, path: string, params: Record<string, string>): string {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function emailCopy(type: "verification" | "password_reset", url: string) {
  if (type === "verification") {
    return {
      subject: "Verify your VERONICA MARK account",
      text: `Confirm your email to finish setting up your account:\n\n${url}\n\nIf you did not create an account, you can ignore this message.`,
      html: `<p>Confirm your email to finish setting up your VERONICA MARK account.</p><p><a href="${url}">Verify email</a></p><p>If you did not create an account, you can ignore this message.</p>`,
    };
  }
  return {
    subject: "Reset your VERONICA MARK password",
    text: `Reset your password using this link (expires soon):\n\n${url}\n\nIf you did not request a reset, you can ignore this message.`,
    html: `<p>Reset your VERONICA MARK password using the link below (expires soon).</p><p><a href="${url}">Reset password</a></p><p>If you did not request a reset, you can ignore this message.</p>`,
  };
}

async function dispatchAuthEmail(
  type: "verification" | "password_reset",
  email: string,
  url: string,
): Promise<void> {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM?.trim() || "VERONICA MARK <onboarding@resend.dev>";

  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      logger.warn({ type, email, url }, "auth.email.development_link");
      return;
    }
    logger.error({ type, email }, "auth.email.missing_resend_api_key");
    return;
  }

  const copy = emailCopy(type, url);
  const result = await resend.emails.send({
    from,
    to: email,
    subject: copy.subject,
    text: copy.text,
    html: copy.html,
  });

  if (result.error) {
    logger.error({ type, email, error: result.error }, "auth.email.send_failed");
    return;
  }

  logger.info({ type, email, id: result.data?.id }, "auth.email.sent");
}

export function sendVerificationEmail(
  email: string,
  rawToken: string,
  baseUrl: string,
): Promise<void> {
  const url = buildAuthUrl(baseUrl, "/auth/verify-email", {
    email: email.toLowerCase(),
    token: rawToken,
  });
  return dispatchAuthEmail("verification", email, url);
}

export function sendPasswordResetEmail(
  email: string,
  rawToken: string,
  baseUrl: string,
): Promise<void> {
  const url = buildAuthUrl(baseUrl, "/auth/reset-password", { token: rawToken });
  return dispatchAuthEmail("password_reset", email, url);
}
