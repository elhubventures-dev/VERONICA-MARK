import "server-only";

import { compare, hash } from "bcryptjs";

import { passwordSchema } from "@/lib/auth/password-policy";
import { ValidationError } from "@/lib/errors";

const BCRYPT_ROUNDS = 12;

export { passwordSchema };

export function hashPassword(password: string): Promise<string> {
  assertPasswordStrength(password);
  return hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

export function assertPasswordStrength(password: string): void {
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    throw new ValidationError(
      "Password does not meet security requirements",
      result.error.flatten(),
    );
  }
}
