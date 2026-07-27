import { NextResponse } from "next/server";

import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { finalizePaystackPayment } from "@/lib/payments/checkout-paystack.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Missing payment reference" } },
        { status: 400 },
      );
    }

    const result = await finalizePaystackPayment(reference);
    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error({ err: error }, "Paystack verify failed");
    const { statusCode, body } = toErrorResponse(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
