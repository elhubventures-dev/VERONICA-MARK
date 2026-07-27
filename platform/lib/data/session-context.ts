import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

/**
 * Resolve the signed-in customer's profile (if any).
 * Returns null for guests / non-customer roles without a profile.
 */
export async function getSessionCustomerProfile() {
  const session = await getCurrentSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  return prisma.customerProfile.findFirst({
    where: { userId, deletedAt: null },
    include: {
      user: true,
      addresses: { where: { deletedAt: null }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] },
      wallets: {
        where: { deletedAt: null },
        include: {
          transactions: { orderBy: { createdAt: "desc" }, take: 20 },
        },
      },
      wishlists: {
        where: { deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null },
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                  media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" }, take: 1 },
                  variants: {
                    where: { deletedAt: null, active: true },
                    include: { inventory: true },
                    orderBy: { price: "asc" },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
      rewardAccount: {
        include: {
          transactions: { orderBy: { createdAt: "desc" }, take: 20 },
        },
      },
      notifications: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });
}

/**
 * Resolve brand manager's assigned brand id for the current session.
 * Uses BrandManagerProfile only — Super Admins have no ambient brand scope.
 */
export async function getSessionBrandId(): Promise<string | null> {
  const session = await getCurrentSession();
  const userId = session?.user?.id;
  if (!userId) return null;
  if (session.user.role !== "BRAND_MANAGER") return null;

  const profile = await prisma.brandManagerProfile.findFirst({
    where: { userId, deletedAt: null },
    select: { brandId: true },
  });
  return profile?.brandId ?? null;
}
