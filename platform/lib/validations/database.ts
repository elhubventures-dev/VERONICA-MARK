import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

export const moneySchema = z
  .union([
    z.number().finite().nonnegative(),
    z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Money must be a valid decimal with up to 2 places"),
  ])
  .transform((value) => (typeof value === "number" ? value : Number(value)));

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUND_REQUESTED",
  "REFUNDED",
]);

export const productStatusSchema = z.enum([
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "OUT_OF_STOCK",
  "ARCHIVED",
]);

export const currencySchema = z.enum(["NGN", "USD", "GBP", "EUR"]);

export const createAddressSchema = z.object({
  customerId: uuidSchema,
  type: z.enum(["BILLING", "SHIPPING"]).default("SHIPPING"),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  country: z.string().trim().min(2).max(2),
  state: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  address1: z.string().trim().min(5).max(200),
  address2: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().max(20).optional(),
  isDefault: z.boolean().default(false),
});

export const createProductVariantSchema = z.object({
  productId: uuidSchema,
  sku: z.string().trim().min(3).max(64),
  barcode: z.string().trim().max(64).optional(),
  price: moneySchema,
  salePrice: moneySchema.optional(),
  weightGrams: z.coerce.number().int().positive().optional(),
  sizeLabel: z.string().trim().max(32).optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[A-Z0-9_-]+$/, "Coupon code must be uppercase alphanumeric"),
  promotionId: uuidSchema,
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
