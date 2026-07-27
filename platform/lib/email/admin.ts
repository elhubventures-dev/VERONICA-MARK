import "server-only";

import type { DetailRow, OrderLineVar } from "@/emails/types";
import { sendTemplateEmail } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import { storefrontContact } from "@/lib/storefront/contact";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Platform admin inbox for client-services copies of every notification. */
export function getPlatformAdminEmail(): string {
  return (
    process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase() ||
    storefrontContact.email.trim().toLowerCase()
  );
}

export type AdminEventInput = {
  eventTitle: string;
  summary: string;
  details?: DetailRow[];
  items?: OrderLineVar[];
  messageBody?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  /** Skip admin send when this equals the admin address (avoids duplicate). */
  clientEmail?: string | null;
};

/**
 * Individually addressed admin copy (Dear Client services…).
 * Never throws.
 */
export async function notifyAdminEvent(input: AdminEventInput): Promise<void> {
  const adminEmail = getPlatformAdminEmail();
  const client = input.clientEmail?.trim().toLowerCase();
  if (client && client === adminEmail) {
    return;
  }

  try {
    await sendTemplateEmail("admin.event", adminEmail, {
      recipientName: "Client services",
      eventTitle: input.eventTitle,
      summary: input.summary,
      details: input.details,
      items: input.items,
      messageBody: input.messageBody,
      ctaUrl: input.ctaUrl || absoluteUrl("/admin"),
      ctaLabel: input.ctaLabel || "Open admin",
      appUrl: absoluteUrl("/").replace(/\/$/, ""),
    });
  } catch (error) {
    logger.error({ err: error, eventTitle: input.eventTitle }, "admin.event.send_failed");
  }
}
