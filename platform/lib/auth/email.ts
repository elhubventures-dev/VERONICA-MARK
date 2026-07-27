import "server-only";

import { renderEmail } from "@/emails";
import { notifyAdminEvent } from "@/lib/email/admin";
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
  const normalized = email.toLowerCase();
  const url = buildAuthUrl(baseUrl, "/auth/verify-email", {
    email: normalized,
    token: rawToken,
  });
  const rendered = renderEmail("auth.email_verification", {
    ctaUrl: url,
    appUrl: baseUrl,
    expiresIn: "one hour",
  });
  await dispatchEmail({
    type: "auth.email_verification",
    to: normalized,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    debugUrl: url,
  });

  // Admin copy — never include the verification token/link.
  await notifyAdminEvent({
    clientEmail: normalized,
    eventTitle: "Email verification sent",
    summary: `A verification email was sent to ${normalized}.`,
    details: [
      { label: "Customer email", value: normalized },
      { label: "Event", value: "auth.email_verification" },
    ],
    ctaUrl: `${baseUrl.replace(/\/$/, "")}/admin/users`,
    ctaLabel: "Open users",
  });
}

export async function sendPasswordResetEmail(
  email: string,
  rawToken: string,
  baseUrl: string,
): Promise<void> {
  const normalized = email.toLowerCase();
  const url = buildAuthUrl(baseUrl, "/auth/reset-password", { token: rawToken });
  const rendered = renderEmail("auth.password_reset", {
    ctaUrl: url,
    appUrl: baseUrl,
    expiresIn: "one hour",
  });
  await dispatchEmail({
    type: "auth.password_reset",
    to: normalized,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    debugUrl: url,
  });

  // Admin copy — never include the reset token/link.
  await notifyAdminEvent({
    clientEmail: normalized,
    eventTitle: "Password reset requested",
    summary: `A password reset email was sent to ${normalized}.`,
    details: [
      { label: "Customer email", value: normalized },
      { label: "Event", value: "auth.password_reset" },
    ],
    ctaUrl: `${baseUrl.replace(/\/$/, "")}/admin/users`,
    ctaLabel: "Open users",
  });
}
