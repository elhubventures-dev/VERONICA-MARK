import { z } from "zod";

import { PASSWORD_MIN_LENGTH } from "@/lib/auth/constants";

/** Shared password policy (safe for client + server). */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");
