import { z } from "zod";

/** UI / API lowercase order statuses (mirrors Prisma OrderStatus). */
export const uiOrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "paid",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "refund_requested",
  "refunded",
]);

export const orderShippingAddressSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z
    .string()
    .trim()
    .max(180)
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Invalid email",
    }),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().max(80).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(80),
});

export const updateOrderStatusSchema = z.object({
  orderNumber: z.string().trim().min(1).max(64),
  status: uiOrderStatusSchema,
  note: z.string().trim().max(500).optional(),
});

export const updateOrderDetailsSchema = z.object({
  orderNumber: z.string().trim().min(1).max(64),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  shippingAddress: orderShippingAddressSchema,
});

export type UiOrderStatus = z.infer<typeof uiOrderStatusSchema>;
export type OrderShippingAddressInput = z.infer<typeof orderShippingAddressSchema>;
