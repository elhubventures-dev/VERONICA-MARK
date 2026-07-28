import "server-only";

import type { BrandStatus, PaymentStatus as PrismaPaymentStatus } from "@prisma/client";

import { listEmailTemplates } from "@/emails";
import {
  adminAnalytics,
  adminAuditLogs,
  adminBrands,
  adminCmsPages,
  adminCustomers,
  adminEmailTemplates,
  adminFeatureFlags,
  adminFraudCases,
  adminLocales,
  adminOrders,
  adminPayments,
  adminPermissions,
  adminPlatform,
  adminReports,
  adminSecurity,
  adminSettings,
  adminShipments,
  adminSystemLogs,
  adminUsers,
  type AdminBrand,
  type AdminBrandStatus,
  type AdminCustomer,
  type AdminFeatureFlag,
  type AdminOrder,
  type AdminPayment,
} from "@/lib/admin/demo-data";
import { prisma } from "@/lib/prisma";
import { brandRepository } from "@/lib/repositories/brand.repository";
import { orderRepository, type OrderWithRelations } from "@/lib/repositories/order.repository";
import { paymentRepository } from "@/lib/repositories/payment.repository";

function mapBrandStatus(status: BrandStatus): AdminBrandStatus {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "PENDING":
      return "pending";
    case "SUSPENDED":
      return "suspended";
    default:
      return "archived";
  }
}

function mapPaymentStatus(status: PrismaPaymentStatus): AdminPayment["status"] {
  switch (status) {
    case "PAID":
      return "succeeded";
    case "PENDING":
    case "AUTHORIZED":
      return "pending";
    case "FAILED":
    case "CANCELLED":
      return "failed";
    default:
      return "refunded";
  }
}

function mapAdminOrder(order: OrderWithRelations): AdminOrder {
  const user = order.customer?.user;
  const brandName =
    order.items.find((i) => i.variant?.product?.brand?.name)?.variant?.product?.brand?.name ?? "—";
  const payment = order.payments[0];
  const shipment = order.shipments[0];

  let paymentStatus: AdminOrder["paymentStatus"] = "pending";
  if (payment?.status === "PAID") paymentStatus = "paid";
  else if (payment?.status === "FAILED" || payment?.status === "CANCELLED") paymentStatus = "failed";
  else if (payment?.status === "REFUNDED" || payment?.status === "PARTIALLY_REFUNDED") {
    paymentStatus = "refunded";
  }

  let shippingStatus: AdminOrder["shippingStatus"] = "unfulfilled";
  if (shipment) {
    const s = shipment.status;
    if (s === "DELIVERED") shippingStatus = "delivered";
    else if (s === "IN_TRANSIT" || s === "OUT_FOR_DELIVERY" || s === "PICKED_UP") shippingStatus = "shipped";
    else if (s === "LABEL_CREATED") shippingStatus = "packed";
  } else if (["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"].includes(order.status)) {
    shippingStatus =
      order.status === "DELIVERED" || order.status === "COMPLETED"
        ? "delivered"
        : order.status === "PACKED"
          ? "packed"
          : "shipped";
  }

  return {
    orderNumber: order.orderNumber,
    placedAt: (order.placedAt ?? order.createdAt).toISOString(),
    status: order.status.toLowerCase(),
    customerName: user ? `${user.firstName} ${user.lastName}`.trim() : "Customer",
    brandName,
    total: Number(order.total),
    currency: order.currency,
    paymentStatus,
    shippingStatus,
  };
}

export async function getAdminPlatform() {
  return adminPlatform;
}

export async function getAdminDashboard() {
  try {
    const [brands, orders, payments] = await Promise.all([
      getAdminBrands(),
      getAdminOrders(),
      getAdminPayments(),
    ]);

    return {
      platform: adminPlatform,
      analytics: {
        ...adminAnalytics,
        orders30d: orders.length,
        totalRevenue30d: orders.reduce((sum, o) => sum + o.total, 0),
      },
      pendingBrands: brands.filter((b) => b.status === "pending"),
      openFraud: adminFraudCases.filter((c) => c.status === "open" || c.status === "reviewing"),
      recentOrders: orders.slice(0, 5),
      recentAudit: adminAuditLogs.slice(0, 5),
      health: {
        payments: payments.filter((p) => p.status === "failed").length,
        shippingExceptions: adminShipments.filter((s) => s.status === "exception").length,
        errorLogs: adminSystemLogs.filter((l) => l.level === "error").length,
      },
    };
  } catch {
    return {
      platform: adminPlatform,
      analytics: adminAnalytics,
      pendingBrands: adminBrands.filter((b) => b.status === "pending"),
      openFraud: adminFraudCases.filter((c) => c.status === "open" || c.status === "reviewing"),
      recentOrders: adminOrders.slice(0, 5),
      recentAudit: adminAuditLogs.slice(0, 5),
      health: {
        payments: adminPayments.filter((p) => p.status === "failed").length,
        shippingExceptions: adminShipments.filter((s) => s.status === "exception").length,
        errorLogs: adminSystemLogs.filter((l) => l.level === "error").length,
      },
    };
  }
}

export async function getAdminBrands(): Promise<AdminBrand[]> {
  try {
    const result = await brandRepository.list({ page: 1, pageSize: 100 });
    if (result.items.length) {
      const withCounts = await Promise.all(
        result.items.map(async (brand) => {
          const [managers, products] = await Promise.all([
            prisma.brandManagerProfile.count({ where: { brandId: brand.id } }),
            prisma.product.count({ where: { brandId: brand.id, deletedAt: null } }),
          ]);
          return {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            status: mapBrandStatus(brand.status),
            managers,
            products,
            revenue30d: 0,
            createdAt: brand.createdAt.toISOString(),
          } satisfies AdminBrand;
        }),
      );
      return withCounts;
    }
  } catch {
    // demo fallback
  }
  return adminBrands;
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  try {
    const customers = await prisma.customerProfile.findMany({
      where: { deletedAt: null },
      include: {
        user: true,
        orders: { where: { deletedAt: null }, select: { total: true } },
        addresses: { where: { deletedAt: null, isDefault: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    if (customers.length) {
      return customers.map((c) => {
        const spend = c.orders.reduce((sum, o) => sum + Number(o.total), 0);
        return {
          id: c.id,
          name: `${c.user.firstName} ${c.user.lastName}`.trim(),
          email: c.user.email,
          status: c.user.deletedAt ? "deleted" : "active",
          orders: c.orders.length,
          spend,
          riskScore: 0,
          country: c.addresses[0]?.country ?? "NG",
          joinedAt: c.createdAt.toISOString(),
        } satisfies AdminCustomer;
      });
    }
  } catch {
    // demo fallback
  }
  return adminCustomers;
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const orders = await orderRepository.listAll(50);
    if (orders.length) return orders.map(mapAdminOrder);
  } catch {
    // demo fallback
  }
  return adminOrders;
}

export async function getAdminOrder(orderNumber: string) {
  try {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (order) return mapAdminOrder(order);
  } catch {
    // demo fallback
  }
  return adminOrders.find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  try {
    const payments = await paymentRepository.listRecent(50);
    if (payments.length) {
      return payments.map((p) => ({
        id: p.id,
        orderNumber: p.order.orderNumber,
        provider: p.provider === "PAYSTACK" ? "Paystack" : "SquadCo",
        amount: Number(p.amount),
        currency: p.currency,
        status: mapPaymentStatus(p.status),
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch {
    // demo fallback
  }
  return adminPayments;
}

export async function getAdminShipments() {
  return adminShipments;
}

export async function getAdminCmsPages() {
  return adminCmsPages;
}

export async function getAdminReports() {
  return adminReports;
}

export async function getAdminFeatureFlags(): Promise<AdminFeatureFlag[]> {
  try {
    const flags = await prisma.featureFlag.findMany({
      where: { deletedAt: null },
      orderBy: { key: "asc" },
    });
    if (flags.length) {
      const byKey = new Map<string, typeof flags>();
      for (const flag of flags) {
        const list = byKey.get(flag.key) ?? [];
        list.push(flag);
        byKey.set(flag.key, list);
      }
      return [...byKey.entries()].map(([key, rows]) => {
        const primary = rows[0]!;
        return {
          id: primary.id,
          key,
          description: primary.description ?? "",
          enabled: rows.some((r) => r.enabled),
          rolloutPercent: primary.rollout,
          environments: rows.map((r) => r.environment.toLowerCase()),
          updatedAt: primary.updatedAt.toISOString(),
        } satisfies AdminFeatureFlag;
      });
    }
  } catch {
    // demo fallback
  }
  return adminFeatureFlags;
}

export async function getAdminLocales() {
  return adminLocales;
}

export async function getAdminEmailTemplates() {
  const catalog = listEmailTemplates();
  if (catalog.length) {
    return catalog.map((template, index) => ({
      id: `et-${index + 1}`,
      key: template.key,
      name: template.name,
      channel: template.channel,
      locale: "en",
      updatedAt: "2026-07-27T05:00:00+01:00",
      description: template.description,
      audience: template.audience,
    }));
  }
  return adminEmailTemplates;
}

export async function getAdminAuditLogs() {
  return adminAuditLogs;
}

export async function getAdminSettings() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: { deletedAt: null },
      orderBy: { key: "asc" },
    });
    if (settings.length) {
      const byKey = Object.fromEntries(
        settings.map((s) => [s.key, typeof s.value === "string" ? s.value : s.value]),
      );
      return {
        ...adminSettings,
        defaultCurrency:
          typeof byKey.default_currency === "string"
            ? byKey.default_currency
            : adminSettings.defaultCurrency,
        guestCheckout: adminSettings.guestCheckout,
        maintenanceMode: adminSettings.maintenanceMode,
      };
    }
  } catch {
    // demo fallback
  }
  return adminSettings;
}

export async function getAdminAnalytics() {
  return adminAnalytics;
}

export async function getAdminFraudCases() {
  return adminFraudCases;
}

export async function getAdminSecurity() {
  return adminSecurity;
}

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    if (users.length) {
      return users.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        role: u.role as "SUPER_ADMIN" | "BRAND_MANAGER" | "CUSTOMER",
        status: "active" as const,
        lastActiveAt: (u.lastLoginAt ?? u.updatedAt).toISOString(),
      }));
    }
  } catch {
    // demo fallback
  }
  return adminUsers;
}

export async function getAdminPermissions() {
  return adminPermissions;
}

export async function getAdminSystemLogs() {
  return adminSystemLogs;
}
