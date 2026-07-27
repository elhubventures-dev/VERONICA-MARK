import "server-only";

import { notifyAdminEvent } from "@/lib/email/admin";
import { sendTemplateEmail } from "@/lib/email/send";
import { getPublicEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import {
  ABANDONED_CART_IDLE_HOURS,
  ABANDONED_CART_SECOND_REMINDER_HOURS,
  type SyncCartLineInput,
} from "@/lib/marketing/abandoned-cart-shared";
import { prisma } from "@/lib/prisma";

export {
  ABANDONED_CART_IDLE_HOURS,
  ABANDONED_CART_SECOND_REMINDER_HOURS,
  parseSyncCartLines,
  type SyncCartLineInput,
} from "@/lib/marketing/abandoned-cart-shared";

function formatNgn(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const MAX_BATCH = 50;

/**
 * Persist authenticated customer cart lines and keep AbandonedCart open while the bag has items.
 */
export async function syncCustomerCartLines(input: {
  customerId: string;
  email: string;
  lines: SyncCartLineInput[];
}): Promise<{ cartId: string; itemCount: number }> {
  const cart = await prisma.cart.findFirst({
    where: { customerId: input.customerId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });

  const cartId =
    cart?.id ??
    (
      await prisma.cart.create({
        data: { customerId: input.customerId },
        select: { id: true },
      })
    ).id;

  const variantIds = input.lines.map((line) => line.variantId);
  const validVariants = variantIds.length
    ? await prisma.productVariant.findMany({
        where: { id: { in: variantIds }, deletedAt: null, active: true },
        select: { id: true },
      })
    : [];
  const validIdSet = new Set(validVariants.map((variant) => variant.id));
  const lines = input.lines.filter((line) => validIdSet.has(line.variantId));

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.updateMany({
      where: { cartId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    for (const line of lines) {
      await tx.cartItem.upsert({
        where: {
          cartId_variantId: { cartId, variantId: line.variantId },
        },
        create: {
          cartId,
          variantId: line.variantId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        },
        update: {
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          deletedAt: null,
        },
      });
    }

    await tx.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  });

  if (lines.length === 0) {
    await prisma.abandonedCart.updateMany({
      where: { cartId, recoveredAt: null, deletedAt: null },
      data: { recoveredAt: new Date() },
    });
  } else {
    const existing = await prisma.abandonedCart.findUnique({ where: { cartId } });
    if (existing) {
      await prisma.abandonedCart.update({
        where: { cartId },
        data: {
          customerId: input.customerId,
          email: input.email.toLowerCase(),
          recoveredAt: null,
          deletedAt: null,
        },
      });
    } else {
      await prisma.abandonedCart.create({
        data: {
          cartId,
          customerId: input.customerId,
          email: input.email.toLowerCase(),
          abandonedAt: new Date(),
          reminderCount: 0,
        },
      });
    }
  }

  return { cartId, itemCount: lines.length };
}

export async function markCustomerAbandonedCartsRecovered(customerId: string): Promise<number> {
  const result = await prisma.abandonedCart.updateMany({
    where: {
      customerId,
      recoveredAt: null,
      deletedAt: null,
    },
    data: { recoveredAt: new Date() },
  });

  const carts = await prisma.cart.findMany({
    where: { customerId, deletedAt: null },
    select: { id: true },
  });

  for (const cart of carts) {
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  return result.count;
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function buildCartEmailVars(abandonedId: string) {
  const abandoned = await prisma.abandonedCart.findFirst({
    where: { id: abandonedId, deletedAt: null },
    include: {
      cart: {
        include: {
          items: {
            where: { deletedAt: null },
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      brand: true,
                    },
                  },
                },
              },
            },
          },
          customer: {
            include: { user: true },
          },
        },
      },
    },
  });

  if (!abandoned?.email || !abandoned.cart.items.length) {
    return null;
  }

  const user = abandoned.cart.customer?.user;
  const recipientName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || undefined
    : undefined;

  const appUrl = getPublicEnv().NEXT_PUBLIC_APP_URL;
  const items = abandoned.cart.items.map((item) => ({
    name: `${item.variant.product.brand.name} · ${item.variant.product.name}`,
    quantity: item.quantity,
    priceLabel: formatNgn(Number(item.unitPrice)),
  }));
  const total = abandoned.cart.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  return {
    email: abandoned.email,
    recipientName,
    items,
    cartTotalLabel: formatNgn(total),
    ctaUrl: `${appUrl.replace(/\/$/, "")}/cart`,
    ctaLabel: "Return to bag",
    appUrl,
    unsubscribeUrl: `${appUrl.replace(/\/$/, "")}/account/preferences`,
  };
}

export type AbandonedCartWorkerResult = {
  scanned: number;
  firstReminders: number;
  secondReminders: number;
  skipped: number;
  errors: number;
};

/**
 * Sends abandoned-cart recovery emails for open bags that have gone idle.
 * Intended for Vercel Cron (or equivalent) invocation.
 */
export async function processAbandonedCartReminders(): Promise<AbandonedCartWorkerResult> {
  const idleBefore = hoursAgo(ABANDONED_CART_IDLE_HOURS);
  const secondBefore = hoursAgo(ABANDONED_CART_SECOND_REMINDER_HOURS);

  const candidates = await prisma.abandonedCart.findMany({
    where: {
      deletedAt: null,
      recoveredAt: null,
      email: { not: null },
      reminderCount: { lt: 2 },
      cart: {
        deletedAt: null,
        items: { some: { deletedAt: null } },
        updatedAt: { lte: idleBefore },
      },
      OR: [
        { reminderCount: 0 },
        {
          reminderCount: 1,
          lastReminderAt: { lte: secondBefore },
        },
      ],
    },
    orderBy: { abandonedAt: "asc" },
    take: MAX_BATCH,
    select: { id: true, reminderCount: true, email: true },
  });

  const result: AbandonedCartWorkerResult = {
    scanned: candidates.length,
    firstReminders: 0,
    secondReminders: 0,
    skipped: 0,
    errors: 0,
  };

  for (const candidate of candidates) {
    try {
      const vars = await buildCartEmailVars(candidate.id);
      if (!vars) {
        result.skipped += 1;
        continue;
      }

      const templateKey = candidate.reminderCount === 0 ? "cart.abandoned_1" : "cart.abandoned_2";
      const sendResult = await sendTemplateEmail(templateKey, vars.email, {
        recipientName: vars.recipientName,
        items: vars.items,
        cartTotalLabel: vars.cartTotalLabel,
        ctaUrl: vars.ctaUrl,
        ctaLabel: vars.ctaLabel,
        appUrl: vars.appUrl,
        unsubscribeUrl: vars.unsubscribeUrl,
      });

      if (!sendResult.ok) {
        result.errors += 1;
        continue;
      }

      await notifyAdminEvent({
        clientEmail: vars.email,
        eventTitle:
          candidate.reminderCount === 0
            ? "Abandoned cart · reminder 1"
            : "Abandoned cart · reminder 2",
        summary: `${vars.recipientName || "Customer"} (${vars.email}) left items in bag · ${vars.cartTotalLabel || ""}`.trim(),
        details: [
          { label: "Customer email", value: vars.email },
          ...(vars.recipientName ? [{ label: "Name", value: vars.recipientName }] : []),
          ...(vars.cartTotalLabel ? [{ label: "Bag total", value: vars.cartTotalLabel }] : []),
          { label: "Reminder", value: String(candidate.reminderCount + 1) },
        ],
        items: vars.items,
        ctaUrl: vars.ctaUrl,
        ctaLabel: "View bag link",
      });

      await prisma.abandonedCart.update({
        where: { id: candidate.id },
        data: {
          reminderCount: candidate.reminderCount + 1,
          lastReminderAt: new Date(),
        },
      });

      if (candidate.reminderCount === 0) {
        result.firstReminders += 1;
      } else {
        result.secondReminders += 1;
      }
    } catch (error) {
      result.errors += 1;
      logger.error({ err: error, abandonedCartId: candidate.id }, "abandoned_cart.reminder_failed");
    }
  }

  logger.info(result, "abandoned_cart.worker_complete");
  return result;
}
