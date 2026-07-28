import "server-only";

import type { OrderStatus as PrismaOrderStatus } from "@prisma/client";

import {
  accountAddresses,
  accountAnalytics,
  accountCoupons,
  accountNotifications,
  accountOrders,
  accountProfile,
  accountReferral,
  accountReturns,
  accountRewards,
  accountSecurity,
  accountSettings,
  accountWallet,
  accountWishlistSlugs,
  type AccountAddress,
  type AccountCoupon,
  type AccountNotification,
  type AccountOrder,
  type AccountOrderLine,
  type AccountProfile,
  type AccountWalletTx,
} from "@/lib/account/demo-data";
import type { OrderStatus } from "@/components/commerce/order-status-badge";
import { getSessionCustomerProfile } from "@/lib/data/session-context";
import { orderRepository, type OrderWithRelations } from "@/lib/repositories/order.repository";
import { promotionRepository } from "@/lib/repositories/promotion.repository";
import { demoProducts, getDemoProductBySlug } from "@/lib/storefront/demo-catalog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

function toUiStatus(status: PrismaOrderStatus): OrderStatus {
  return status.toLowerCase() as OrderStatus;
}

function mapShippingAddress(raw: unknown): AccountOrder["shippingAddress"] {
  const addr = (raw ?? {}) as Record<string, string | undefined>;
  return {
    name: addr.name ?? addr.fullName ?? "",
    line1: addr.line1 ?? addr.address1 ?? "",
    line2: addr.line2 ?? addr.address2,
    city: addr.city ?? "",
    postalCode: addr.postalCode ?? "",
    country: addr.country ?? "",
  };
}

function mapOrderLine(item: OrderWithRelations["items"][number]): AccountOrderLine {
  const media = item.variant?.product?.media?.[0];
  return {
    title: item.productName,
    brand: item.variant?.product?.brand?.name ?? "",
    variant: item.variantName ?? "",
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    image: media?.url ?? FALLBACK_IMAGE,
    productSlug: item.variant?.product?.slug,
  };
}

function buildTimeline(order: OrderWithRelations): AccountOrder["timeline"] {
  const history = order.statusHistory ?? [];
  if (history.length) {
    return history.map((h, index) => ({
      label: h.toStatus.replaceAll("_", " ").toLowerCase(),
      at: h.createdAt.toISOString(),
      done: index < history.length - 1 || order.status === "COMPLETED" || order.status === "DELIVERED",
    }));
  }
  return [
    { label: "placed", at: order.createdAt.toISOString(), done: true },
    { label: toUiStatus(order.status), at: (order.placedAt ?? order.updatedAt).toISOString(), done: true },
  ];
}

function mapDbOrder(order: OrderWithRelations): AccountOrder {
  return {
    orderNumber: order.orderNumber,
    placedAt: (order.placedAt ?? order.createdAt).toISOString(),
    status: toUiStatus(order.status),
    email: order.customer?.user?.email ?? "",
    shippingAddress: mapShippingAddress(order.shippingAddress),
    items: order.items.map(mapOrderLine),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shippingFee),
    discount: Number(order.discount),
    total: Number(order.total),
    currency: order.currency,
    trackingNumber: order.shipments[0]?.trackingNumber ?? undefined,
    timeline: buildTimeline(order),
  };
}

export async function getAccountOverview() {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile) {
      const orders = await orderRepository.listByCustomer(profile.id, 5);
      const mapped = orders.map(mapDbOrder);
      const wallet = profile.wallets[0];
      const wishlistCount = profile.wishlists.reduce((sum, w) => sum + w.items.length, 0);
      const unread = profile.notifications.filter((n) => !n.readAt).length;
      const coupons = await promotionRepository.listCoupons(10);

      return {
        recentOrders: mapped.slice(0, 3),
        rewardsBalance: profile.rewardAccount?.balance ?? 0,
        rewardsTier: accountRewards.tier,
        wishlistCount,
        availableCoupons: coupons.filter((c) => c.status === "ACTIVE").length,
        unreadNotifications: unread,
        walletBalance: wallet ? Number(wallet.balance) : 0,
        walletCurrency: wallet?.currency ?? "NGN",
        recommended: demoProducts.slice(0, 4),
      };
    }
  } catch {
    // demo fallback
  }

  const unread = accountNotifications.filter((n) => !n.read).length;
  return {
    recentOrders: accountOrders.slice(0, 3),
    rewardsBalance: accountRewards.points,
    rewardsTier: accountRewards.tier,
    wishlistCount: accountWishlistSlugs.length,
    availableCoupons: accountCoupons.filter((c) => c.status === "available").length,
    unreadNotifications: unread,
    walletBalance: accountWallet.balance,
    walletCurrency: accountWallet.currency,
    recommended: demoProducts.slice(0, 4),
  };
}

export async function getAccountOrders() {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile) {
      const orders = await orderRepository.listByCustomer(profile.id, 50);
      if (orders.length) return orders.map(mapDbOrder);
    }
  } catch {
    // demo fallback
  }
  return accountOrders;
}

export async function getAccountOrder(orderNumber: string): Promise<AccountOrder | null> {
  try {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (order) {
      const profile = await getSessionCustomerProfile();
      if (!profile || order.customerId === profile.id) {
        return mapDbOrder(order);
      }
    }
  } catch {
    // demo fallback
  }
  return accountOrders.find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function getAccountInvoices() {
  const orders = await getAccountOrders();
  return orders.filter((o) =>
    ["confirmed", "paid", "processing", "packed", "shipped", "out_for_delivery", "delivered", "completed"].includes(
      o.status,
    ),
  );
}

export async function getAccountWishlistProducts() {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile) {
      const products = profile.wishlists.flatMap((w) =>
        w.items.map((item) => {
          const p = item.product;
          const variant = p.variants[0];
          const media = p.media[0];
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand.name,
            brandSlug: p.brand.slug,
            category: p.category.name,
            categorySlug: p.category.slug,
            price: Number(variant?.salePrice ?? variant?.price ?? 0),
            compareAt: variant?.salePrice ? Number(variant.price) : undefined,
            image: media?.url ?? FALLBACK_IMAGE,
            badge: p.featured ? ("exclusive" as const) : ("new" as const),
          };
        }),
      );
      if (products.length) return products;
    }
  } catch {
    // demo fallback
  }

  return accountWishlistSlugs
    .map((slug) => getDemoProductBySlug(slug) ?? demoProducts.find((p) => p.slug === slug))
    .filter(Boolean);
}

export async function getAccountRewards() {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile?.rewardAccount) {
      return {
        ...accountRewards,
        points: profile.rewardAccount.balance,
        lifetimeEarned: profile.rewardAccount.lifetimeEarned,
        transactions: profile.rewardAccount.transactions.map((tx) => ({
          id: tx.id,
          points: tx.points,
          description: tx.reason,
          createdAt: tx.createdAt.toISOString(),
        })),
      };
    }
  } catch {
    // demo fallback
  }
  return accountRewards;
}

export async function getAccountWallet() {
  try {
    const profile = await getSessionCustomerProfile();
    const wallet = profile?.wallets[0];
    if (wallet) {
      const transactions: AccountWalletTx[] = wallet.transactions.map((tx) => ({
        id: tx.id,
        type: tx.type === "DEBIT" || tx.type === "EXPIRY" ? "debit" : "credit",
        amount: Number(tx.amount),
        currency: wallet.currency,
        description: tx.description ?? tx.type,
        createdAt: tx.createdAt.toISOString(),
      }));
      return {
        ...accountWallet,
        balance: Number(wallet.balance),
        currency: wallet.currency,
        transactions: transactions.length ? transactions : accountWallet.transactions,
      };
    }
  } catch {
    // demo fallback
  }
  return accountWallet;
}

export async function getAccountCoupons(): Promise<AccountCoupon[]> {
  try {
    const coupons = await promotionRepository.listCoupons(20);
    if (coupons.length) {
      const now = Date.now();
      return coupons.map((c) => {
        const expired = c.expiresAt ? c.expiresAt.getTime() < now : false;
        return {
          id: c.id,
          code: c.code,
          title: c.promotion.name,
          description: c.promotion.description ?? "",
          type: c.promotion.type as AccountCoupon["type"],
          value: Number(c.promotion.value),
          expiresAt: (c.expiresAt ?? c.promotion.endsAt).toISOString(),
          status: expired || c.status === "EXPIRED" ? "expired" : c.status === "ACTIVE" ? "available" : "used",
        };
      });
    }
  } catch {
    // demo fallback
  }
  return accountCoupons;
}

export async function getAccountAddresses(): Promise<AccountAddress[]> {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile?.addresses.length) {
      return profile.addresses.map((a) => ({
        id: a.id,
        label: a.company ?? (a.isDefault ? "Default" : a.type),
        type: a.type as AccountAddress["type"],
        name: a.fullName,
        line1: a.address1,
        line2: a.address2 ?? undefined,
        city: a.city,
        postalCode: a.postalCode ?? "",
        country: a.country,
        phone: a.phone,
        isDefault: a.isDefault,
      }));
    }
  } catch {
    // demo fallback
  }
  return accountAddresses;
}

export async function getAccountProfile(): Promise<AccountProfile> {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile?.user) {
      return {
        firstName: profile.user.firstName ?? accountProfile.firstName,
        lastName: profile.user.lastName ?? accountProfile.lastName,
        email: profile.user.email,
        phone: profile.user.phone ?? accountProfile.phone,
        dateOfBirth: profile.dateOfBirth?.toISOString().slice(0, 10) ?? accountProfile.dateOfBirth,
        gender: profile.gender ?? accountProfile.gender,
        language: accountProfile.language,
        currency: profile.user.preferredCurrency ?? accountProfile.currency,
        timezone: accountProfile.timezone,
      };
    }
  } catch {
    // demo fallback
  }
  return accountProfile;
}

export async function getAccountNotifications(): Promise<AccountNotification[]> {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile?.notifications.length) {
      return profile.notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.message,
        createdAt: n.createdAt.toISOString(),
        read: Boolean(n.readAt),
        href: n.actionUrl ?? undefined,
        category: "system",
      }));
    }
  } catch {
    // demo fallback
  }
  return accountNotifications;
}

export async function getAccountReturns() {
  return accountReturns;
}

export async function getAccountReturn(id: string) {
  return accountReturns.find((r) => r.id === id) ?? null;
}

export async function getAccountReferral() {
  return accountReferral;
}

export async function getAccountSecurity() {
  return accountSecurity;
}

export async function getAccountSettings() {
  return accountSettings;
}

export async function getAccountAnalytics() {
  try {
    const profile = await getSessionCustomerProfile();
    if (profile) {
      const orders = await orderRepository.listByCustomer(profile.id, 100);
      if (orders.length) {
        const spend = orders.reduce((sum, o) => sum + Number(o.total), 0);
        return {
          ...accountAnalytics,
          ordersPlaced: orders.length,
          spendYtd: spend,
          avgOrderValue: spend / orders.length,
        };
      }
    }
  } catch {
    // demo fallback
  }
  return accountAnalytics;
}
