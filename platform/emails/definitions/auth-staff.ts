import { greet, resolveAppUrl } from "@/emails/layout";
import type {
  AuthEmailVars,
  BaseEmailVars,
  EmailContent,
  StaffInviteVars,
} from "@/emails/types";

function authCta(vars: AuthEmailVars, fallbackLabel: string) {
  return {
    label: vars.ctaLabel || fallbackLabel,
    href: vars.ctaUrl,
  };
}

export function buildAuthEmailVerification(vars: AuthEmailVars): EmailContent {
  return {
    subject: "Verify your VERONICA MARK account",
    previewText: "Confirm your email to finish setting up your account.",
    eyebrow: "Account",
    heading: "Verify your email",
    paragraphs: [
      greet(vars.recipientName),
      "Thank you for joining VERONICA MARK. Please confirm your email address to complete your account and enjoy a seamless shopping experience.",
      vars.expiresIn
        ? `This verification link expires in ${vars.expiresIn}.`
        : "This verification link expires in one hour.",
      "If you did not create an account, you may ignore this message.",
    ],
    cta: authCta(vars, "Verify email"),
  };
}

export function buildAuthPasswordReset(vars: AuthEmailVars): EmailContent {
  return {
    subject: "Reset your VERONICA MARK password",
    previewText: "Use this secure link to choose a new password.",
    eyebrow: "Security",
    heading: "Reset your password",
    paragraphs: [
      greet(vars.recipientName),
      "We received a request to reset the password for your VERONICA MARK account. Use the button below to choose a new password.",
      vars.expiresIn
        ? `This link expires in ${vars.expiresIn}.`
        : "This link expires soon for your security.",
      "If you did not request a reset, you can safely ignore this email — your password will remain unchanged.",
    ],
    cta: authCta(vars, "Reset password"),
  };
}

export function buildAuthWelcome(vars: BaseEmailVars & { ctaUrl?: string; ctaLabel?: string }): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: "Welcome to VERONICA MARK",
    previewText: "Curated for the Exceptional — your account is ready.",
    eyebrow: "Welcome",
    heading: "Your account is ready",
    paragraphs: [
      greet(vars.recipientName),
      "Welcome to VERONICA MARK — a luxury marketplace curating exceptional products from trusted brands.",
      "Explore the edit, save favourites to your wishlist, and track orders, invoices and rewards from your account.",
      "Every product. Every interaction. Every experience — Curated for the Exceptional.",
    ],
    cta: {
      label: vars.ctaLabel || "Explore the edit",
      href: vars.ctaUrl || appUrl,
    },
  };
}

export function buildAuthPasswordChanged(
  vars: BaseEmailVars & { ctaUrl?: string; ctaLabel?: string },
): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: "Your VERONICA MARK password was changed",
    previewText: "A security confirmation for your account.",
    eyebrow: "Security",
    heading: "Password updated",
    paragraphs: [
      greet(vars.recipientName),
      "This is a confirmation that the password for your VERONICA MARK account was changed successfully.",
      "If you made this change, no further action is needed.",
      "If you did not change your password, please reset it immediately and contact client services.",
    ],
    cta: {
      label: vars.ctaLabel || "Review account security",
      href: vars.ctaUrl || `${appUrl}/account/settings`,
    },
    tone: "warning",
  };
}

export function buildAuthAccountDisabled(
  vars: BaseEmailVars & { ctaUrl?: string; ctaLabel?: string; reason?: string },
): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: "Your VERONICA MARK account access has changed",
    previewText: "Important notice regarding your account status.",
    eyebrow: "Account",
    heading: "Account access updated",
    paragraphs: [
      greet(vars.recipientName),
      "Access to your VERONICA MARK account has been restricted.",
      vars.reason
        ? `Reason: ${vars.reason}`
        : "If you believe this was done in error, please contact client services with your registered email address.",
      "Our team is available to help resolve any questions about your account.",
    ],
    cta: {
      label: vars.ctaLabel || "Contact client services",
      href: vars.ctaUrl || `${appUrl}/contact`,
    },
    tone: "urgent",
  };
}

export function buildStaffAdminInvite(vars: StaffInviteVars): EmailContent {
  return {
    subject: "You are invited to VERONICA MARK Admin",
    previewText: "Accept your Super Admin invitation.",
    eyebrow: "Admin invitation",
    heading: "Join the admin workspace",
    paragraphs: [
      greet(vars.recipientName),
      vars.inviterName
        ? `${vars.inviterName} has invited you to join VERONICA MARK as ${vars.roleLabel}.`
        : `You have been invited to join VERONICA MARK as ${vars.roleLabel}.`,
      "Accept the invitation to set your credentials and access the Super Admin dashboard.",
      vars.expiresIn
        ? `This invitation expires in ${vars.expiresIn}.`
        : "This invitation link will expire for security.",
    ],
    details: [
      { label: "Role", value: vars.roleLabel },
      ...(vars.inviterName ? [{ label: "Invited by", value: vars.inviterName }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Accept invitation",
      href: vars.ctaUrl,
    },
  };
}

export function buildStaffBrandManagerInvite(vars: StaffInviteVars): EmailContent {
  return {
    subject: vars.brandName
      ? `You are invited to manage ${vars.brandName} on VERONICA MARK`
      : "You are invited to VERONICA MARK Brand Management",
    previewText: "Accept your Brand Manager invitation.",
    eyebrow: "Brand invitation",
    heading: "Join your brand workspace",
    paragraphs: [
      greet(vars.recipientName),
      vars.brandName
        ? `You have been invited to manage ${vars.brandName} on VERONICA MARK as ${vars.roleLabel}.`
        : `You have been invited to join VERONICA MARK as ${vars.roleLabel}.`,
      "Accept the invitation to access orders, inventory, and brand settings for your assigned brand.",
      vars.expiresIn
        ? `This invitation expires in ${vars.expiresIn}.`
        : "This invitation link will expire for security.",
    ],
    details: [
      { label: "Role", value: vars.roleLabel },
      ...(vars.brandName ? [{ label: "Brand", value: vars.brandName }] : []),
      ...(vars.inviterName ? [{ label: "Invited by", value: vars.inviterName }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Accept invitation",
      href: vars.ctaUrl,
    },
  };
}
