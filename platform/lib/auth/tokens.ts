import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { EMAIL_VERIFY_TTL_MS, PASSWORD_RESET_TTL_MS } from "@/lib/auth/constants";
import { assertPasswordStrength, hashPassword } from "@/lib/auth/password";
import { UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

function hashSecureToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function generateSecureToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("base64url");
  return { raw, hash: hashSecureToken(raw) };
}

export async function createEmailVerificationToken(email: string): Promise<string> {
  const identifier = email.trim().toLowerCase();
  const { raw, hash } = generateSecureToken();

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: hash,
        expires: new Date(Date.now() + EMAIL_VERIFY_TTL_MS),
      },
    }),
  ]);

  return raw;
}

export async function consumeEmailVerificationToken(
  email: string,
  rawToken: string,
): Promise<boolean> {
  const identifier = email.trim().toLowerCase();
  const token = hashSecureToken(rawToken);

  return prisma.$transaction(async (tx) => {
    const claimed = await tx.verificationToken.deleteMany({
      where: {
        token,
        identifier,
        expires: { gt: new Date() },
      },
    });
    if (claimed.count !== 1) {
      return false;
    }

    const updated = await tx.user.updateMany({
      where: { email: identifier, deletedAt: null },
      data: { emailVerified: new Date() },
    });
    return updated.count === 1;
  });
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const { raw, hash } = generateSecureToken();

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    }),
  ]);

  return raw;
}

export async function consumePasswordResetToken(
  rawToken: string,
  newPassword: string,
): Promise<string> {
  assertPasswordStrength(newPassword);
  const tokenHash = hashSecureToken(rawToken);
  const passwordHash = await hashPassword(newPassword);

  return prisma.$transaction(async (tx) => {
    const token = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!token || token.usedAt || token.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError("Password reset token is invalid or expired");
    }

    const claimed = await tx.passwordResetToken.updateMany({
      where: { id: token.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (claimed.count !== 1) {
      throw new UnauthorizedError("Password reset token is invalid or expired");
    }

    await tx.user.update({
      where: { id: token.userId },
      data: { passwordHash },
    });
    return token.userId;
  });
}
