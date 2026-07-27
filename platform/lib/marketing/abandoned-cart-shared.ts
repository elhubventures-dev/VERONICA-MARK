import { z } from "zod";

const syncLineSchema = z.object({
  variantId: z.string().min(1).max(64),
  quantity: z.number().int().positive().max(99),
  unitPrice: z.number().nonnegative(),
});

export type SyncCartLineInput = z.infer<typeof syncLineSchema>;

/** Hours after last cart activity before first recovery email. */
export const ABANDONED_CART_IDLE_HOURS = 1;
/** Hours after first reminder before second recovery email. */
export const ABANDONED_CART_SECOND_REMINDER_HOURS = 23;

export function parseSyncCartLines(raw: unknown): SyncCartLineInput[] {
  return z.array(syncLineSchema).max(50).parse(raw);
}
