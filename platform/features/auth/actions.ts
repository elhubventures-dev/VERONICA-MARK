"use server";

import { cookies, headers } from "next/headers";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signUpSchema,
  verifyEmailSchema,
} from "@/features/auth/schemas";
import { createAction } from "@/lib/actions/create-action";
import type { ActionResult } from "@/lib/actions/create-action";
import { CSRF_COOKIE_NAME, hashToken, validateCsrfToken } from "@/lib/auth/csrf";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/auth/email";
import { hashPassword } from "@/lib/auth/password";
import { assertAuthRateLimit } from "@/lib/auth/rate-limit";
import { logSecurityEvent } from "@/lib/auth/security-log";
import { getCurrentSession } from "@/lib/auth/session";
import {
  consumeEmailVerificationToken,
  consumePasswordResetToken,
  createEmailVerificationToken,
  createPasswordResetToken,
} from "@/lib/auth/tokens";
import { signOut } from "@/lib/auth";
import { ConflictError, ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type CsrfInput = { csrfToken?: string };

async function requestContext(): Promise<{ ip?: string; userAgent?: string }> {
  const requestHeaders = await headers();
  return {
    ip:
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      requestHeaders.get("x-real-ip") ??
      undefined,
    userAgent: requestHeaders.get("user-agent") ?? undefined,
  };
}

async function requireCsrf(input: CsrfInput, email?: string): Promise<void> {
  const cookieStore = await cookies();
  const valid = await validateCsrfToken(cookieStore.get(CSRF_COOKIE_NAME)?.value, input.csrfToken);
  if (!valid) {
    await logSecurityEvent({ type: "CSRF_FAILURE", email, ...(await requestContext()) });
    throw new ForbiddenError("Invalid CSRF token");
  }
}

export const registerAction = createAction(
  "auth.register",
  { schema: signUpSchema },
  async (input) => {
    await requireCsrf(input, input.email);
    await assertAuthRateLimit("register", input.email);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.$transaction(async (tx) => {
      const customerRole = await tx.role.findFirst({
        where: { name: "CUSTOMER", deletedAt: null },
        select: { id: true },
      });
      if (!customerRole) {
        throw new Error("The CUSTOMER system role is not configured");
      }
      return tx.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          passwordHash,
          role: "CUSTOMER",
          customerProfile: { create: {} },
          preference: { create: {} },
          roleAssignments: { create: { roleId: customerRole.id } },
        },
        select: { id: true, email: true },
      });
    });

    const rawToken = await createEmailVerificationToken(user.email);
    await sendVerificationEmail(user.email, rawToken, env.client.NEXT_PUBLIC_APP_URL);
    await logSecurityEvent({
      type: "REGISTER",
      userId: user.id,
      email: user.email,
      ...(await requestContext()),
    });
    return { userId: user.id, verificationRequired: true };
  },
);

export const requestPasswordResetAction = createAction(
  "auth.password_reset.request",
  { schema: forgotPasswordSchema },
  async (input) => {
    await requireCsrf(input, input.email);
    await assertAuthRateLimit("forgotPassword", input.email);
    const user = await prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
      select: { id: true, email: true },
    });

    if (user) {
      const rawToken = await createPasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, rawToken, env.client.NEXT_PUBLIC_APP_URL);
      await logSecurityEvent({
        type: "PASSWORD_RESET_REQUEST",
        userId: user.id,
        email: user.email,
        ...(await requestContext()),
      });
    }
    return { accepted: true };
  },
);

export const resetPasswordAction = createAction(
  "auth.password_reset.confirm",
  { schema: resetPasswordSchema },
  async (input) => {
    await requireCsrf(input);
    await assertAuthRateLimit("resetPassword", await hashToken(input.token));
    const userId = await consumePasswordResetToken(input.token, input.password);
    await logSecurityEvent({
      type: "PASSWORD_RESET_SUCCESS",
      userId,
      ...(await requestContext()),
    });
    return { userId };
  },
);

export const requestEmailVerificationAction = createAction(
  "auth.email_verification.request",
  { schema: forgotPasswordSchema },
  async (input) => {
    await requireCsrf(input, input.email);
    await assertAuthRateLimit("forgotPassword", input.email);
    const user = await prisma.user.findFirst({
      where: { email: input.email, deletedAt: null, emailVerified: null },
      select: { id: true, email: true },
    });
    if (user) {
      const rawToken = await createEmailVerificationToken(user.email);
      await sendVerificationEmail(user.email, rawToken, env.client.NEXT_PUBLIC_APP_URL);
    }
    return { accepted: true };
  },
);

export const confirmEmailVerificationAction = createAction(
  "auth.email_verification.confirm",
  { schema: verifyEmailSchema },
  async (input) => {
    // CSRF not required: the emailed one-time token is the proof of intent (GET link flow).
    const verified = await consumeEmailVerificationToken(input.email, input.token);
    const user = verified
      ? await prisma.user.findUnique({
          where: { email: input.email },
          select: { id: true },
        })
      : null;
    await logSecurityEvent({
      type: verified ? "EMAIL_VERIFY" : "EMAIL_VERIFY_FAILURE",
      userId: user?.id,
      email: input.email,
      ...(await requestContext()),
    });
    if (!verified) {
      throw new UnauthorizedError("Email verification token is invalid or expired");
    }
    return { verified: true };
  },
);

export async function signOutAction(
  input: CsrfInput = {},
): Promise<ActionResult<{ signedOut: true }>> {
  return createAction("auth.sign_out", {}, async (payload: CsrfInput) => {
    await requireCsrf(payload);
    const session = await getCurrentSession();
    if (session?.user) {
      await logSecurityEvent({
        type: "SIGN_OUT",
        userId: session.user.id,
        email: session.user.email,
        ...(await requestContext()),
      });
    }
    await signOut({ redirect: false });
    return { signedOut: true as const };
  })(input);
}
