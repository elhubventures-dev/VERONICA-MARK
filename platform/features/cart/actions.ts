"use server";

import { auth } from "@/lib/auth";
import {
  markCustomerAbandonedCartsRecovered,
  parseSyncCartLines,
  syncCustomerCartLines,
} from "@/lib/marketing/abandoned-cart";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * Persist the signed-in customer's bag to Prisma for abandoned-cart recovery.
 * Guests stay on localStorage only until they authenticate.
 */
export async function syncCartLines(rawLines: unknown): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email;
    if (!userId || !email) {
      return { ok: true };
    }

    const lines = parseSyncCartLines(rawLines);
    let profile = await prisma.customerProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!profile) {
      profile = await prisma.customerProfile.create({
        data: { userId },
        select: { id: true },
      });
    }

    await syncCustomerCartLines({
      customerId: profile.id,
      email,
      lines,
    });

    return { ok: true };
  } catch (error) {
    logger.warn({ err: error }, "cart.sync_failed");
    return { ok: false };
  }
}

export async function mergeGuestCart(_sessionId: string): Promise<{ ok: boolean }> {
  return { ok: true };
}

export async function clearServerCart(_cartId?: string): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { ok: true };

    const profile = await prisma.customerProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
    if (!profile) return { ok: true };

    // Soft-deletes cart lines and marks abandoned-cart rows recovered.
    await markCustomerAbandonedCartsRecovered(profile.id);
    return { ok: true };
  } catch (error) {
    logger.warn({ err: error }, "cart.clear_server_failed");
    return { ok: false };
  }
}
