import { z } from "zod";

export const emailSchema = z.string().trim().email().max(255);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const moneySchema = z
  .number()
  .finite()
  .nonnegative()
  .refine((value) => Number.isInteger(Math.round(value * 100)), {
    message: "Money values support up to 2 decimal places",
  });

export type PaginationInput = z.infer<typeof paginationSchema>;

export function toSkipTake(pagination: PaginationInput): { skip: number; take: number } {
  return {
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  };
}
