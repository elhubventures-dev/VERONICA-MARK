"use server";

import { z } from "zod";

import { notifyAdminEvent } from "@/lib/email/admin";
import { sendTemplateEmail } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  storefrontContact,
} from "@/lib/storefront/contact";

export type ContactActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  topic: z.string().trim().min(1).max(80),
  message: z.string().trim().min(12).max(5000),
});

const orderSupportSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  orderNumber: z.string().trim().min(1).max(64),
  message: z.string().trim().min(8).max(5000),
});

const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

const TOPIC_LABELS: Record<string, string> = {
  general: "General enquiry",
  product: "Product advice",
  partnership: "Brand partnership",
  other: "Something else",
};

/**
 * Contact enquiry — client auto-reply + admin internal notify (individually addressed).
 */
export async function submitContactEnquiryAction(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    const parsed = enquirySchema.parse(input);
    const topicLabel = TOPIC_LABELS[parsed.topic] || parsed.topic;
    const subject = `Enquiry · ${topicLabel}`;
    const clientEmail = parsed.email.toLowerCase();

    await sendTemplateEmail("contact.auto_reply", clientEmail, {
      senderName: parsed.name,
      senderEmail: clientEmail,
      recipientName: parsed.name,
      subject,
      message: parsed.message,
      topic: topicLabel,
      appUrl: absoluteUrl("/").replace(/\/$/, ""),
    });

    await sendTemplateEmail("contact.internal_notify", storefrontContact.email, {
      senderName: parsed.name,
      senderEmail: clientEmail,
      subject,
      message: parsed.message,
      topic: topicLabel,
    });

    return { ok: true, message: "Thank you — your message has been received." };
  } catch (error) {
    logger.warn({ err: error }, "contact.enquiry_failed");
    return {
      ok: false,
      message: `We could not send your message. Please email ${storefrontContact.email} or call ${storefrontContact.phone}.`,
    };
  }
}

/**
 * Order support form — client auto-reply + admin notify with order reference.
 */
export async function submitContactOrderSupportAction(input: {
  name: string;
  email: string;
  orderNumber: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    const parsed = orderSupportSchema.parse(input);
    const clientEmail = parsed.email.toLowerCase();
    const subject = `Order support · ${parsed.orderNumber}`;

    await sendTemplateEmail("contact.auto_reply", clientEmail, {
      senderName: parsed.name,
      senderEmail: clientEmail,
      recipientName: parsed.name,
      subject,
      message: parsed.message,
      topic: "Order support",
      orderNumber: parsed.orderNumber,
      appUrl: absoluteUrl("/").replace(/\/$/, ""),
    });

    await sendTemplateEmail("contact.internal_notify", storefrontContact.email, {
      senderName: parsed.name,
      senderEmail: clientEmail,
      subject,
      message: parsed.message,
      topic: "Order support",
      orderNumber: parsed.orderNumber,
    });

    return { ok: true, message: "Request received. We will follow up shortly." };
  } catch (error) {
    logger.warn({ err: error }, "contact.order_support_failed");
    return {
      ok: false,
      message: `We could not send your request. Please email ${storefrontContact.email} or WhatsApp ${storefrontContact.phone} with your order reference.`,
    };
  }
}

/**
 * Newsletter signup — client welcome + admin event copy.
 */
export async function submitNewsletterSignupAction(input: {
  email: string;
}): Promise<ContactActionResult> {
  try {
    const parsed = newsletterSchema.parse(input);
    const clientEmail = parsed.email.toLowerCase();

    await sendTemplateEmail("newsletter.welcome", clientEmail, {
      recipientName: undefined,
      ctaUrl: absoluteUrl("/"),
      appUrl: absoluteUrl("/").replace(/\/$/, ""),
      unsubscribeUrl: absoluteUrl("/account/settings"),
    });

    await notifyAdminEvent({
      clientEmail,
      eventTitle: "Newsletter signup",
      summary: `${clientEmail} joined the VERONICA MARK private list.`,
      details: [
        { label: "Email", value: clientEmail },
        { label: "Event", value: "newsletter.welcome" },
      ],
      ctaUrl: absoluteUrl("/admin/marketing/email-campaigns"),
      ctaLabel: "Open email campaigns",
    });

    return { ok: true, message: "Welcome to the VERONICA MARK private list." };
  } catch (error) {
    logger.warn({ err: error }, "newsletter.signup_failed");
    return { ok: false, message: "Enter a valid email address to join." };
  }
}
