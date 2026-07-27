import "server-only";

import { renderEmail } from "@/emails";
import { dispatchEmail } from "@/lib/email/send";

function buildAuthUrl(baseUrl: string, path: string, params: Record<string, string>): string {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export async function sendVerificationEmail(
  email: string,
  rawToken: string,
  baseUrl: string,
): Promise<void> {
  const url = buildAuthUrl(baseUrl, "/auth/verify-email", {
    email: email.toLowerCase(),
    token: rawToken,
  });
  const rendered = renderEmail("auth.email_verification", {
    ctaUrl: url,
    appUrl: baseUrl,
    expiresIn: "one hour",
  });
  await dispatchEmail({
    type: "auth.email_verification",
    to: email,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    debugUrl: url,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  rawToken: string,
  baseUrl: string,
): Promise<void> {
  const url = buildAuthUrl(baseUrl, "/auth/reset-password", { token: rawToken });
  const rendered = renderEmail("auth.password_reset", {
    ctaUrl: url,
    appUrl: baseUrl,
    expiresIn: "one hour",
  });
  await dispatchEmail({
    type: "auth.password_reset",
    to: email,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    debugUrl: url,
  });
}
