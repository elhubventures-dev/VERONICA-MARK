import { z } from "zod";

import { PASSWORD_MIN_LENGTH } from "@/lib/auth/constants";

const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((email) => email.toLowerCase());
const csrfField = { csrfToken: z.string().min(1).optional() };
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  ...csrfField,
});

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^[\d+\-\s()]+$/, "Enter a valid phone number");

export const signUpSchema = z
  .object({
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    ...csrfField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  ...csrfField,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
    ...csrfField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: emailSchema,
  token: z.string().min(1),
  csrfToken: z.string().min(1).optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
