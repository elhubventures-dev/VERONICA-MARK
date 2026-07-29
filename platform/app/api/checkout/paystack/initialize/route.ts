import { NextResponse } from "next/server";
import { z } from "zod";

import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { initializePaystackCheckout } from "@/lib/payments/checkout-paystack.service";

const bodySchema = z.object({
  shipping: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z
      .string()
      .min(1)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }, "Invalid phone number"),
    line1: z.string().optional().default(""),
    line2: z.string().optional(),
    city: z.string().optional().default(""),
    state: z.string().optional(),
    postalCode: z.string().optional().default(""),
    country: z.string().min(2),
  }),
  shippingMethod: z.enum(["intra_city", "interstate", "express", "international"]),
  lines: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
        product: z.object({
          slug: z.string(),
          name: z.string(),
          brand: z.string(),
          image: z.string(),
          variantLabel: z.string(),
          price: z.number().positive(),
        }),
      }),
    )
    .min(1),
  couponCode: z.string().nullable().optional(),
  couponDiscount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid checkout payload", details: parsed.error.flatten() } },
        { status: 400 },
      );
    }

    const result = await initializePaystackCheckout(parsed.data);
    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error({ err: error }, "Paystack initialize failed");
    const { statusCode, body } = toErrorResponse(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
