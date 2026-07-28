import "server-only";

import type { OrderStatus as PrismaOrderStatus, ProductStatus } from "@prisma/client";

import type { OrderStatus } from "@/components/commerce/order-status-badge";
import {
  brandActivityLogs,
  brandAnalytics,
  brandCoupons,
  brandCustomers,
  brandFlashSales,
  brandInventory,
  brandMedia,
  brandOrders,
  brandProducts,
  brandProfile,
  brandReports,
  brandSettings,
  brandWorkspace,
  type BrandInventoryRow,
  type BrandOrder,
  type BrandProduct,
  type BrandProductEditor,
  type BrandProductStatus,
} from "@/lib/brand/demo-data";
import { getSessionBrandId } from "@/lib/data/session-context";
import { orderBelongsToBrand } from "@/lib/auth/brand-tenancy-rules";
import { brandRepository } from "@/lib/repositories/brand.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { inventoryRepository } from "@/lib/repositories/inventory.repository";
import { orderRepository, type OrderWithRelations } from "@/lib/repositories/order.repository";
import {
  productRepository,
  type EditorProduct,
} from "@/lib/repositories/product.repository";
import { promotionRepository } from "@/lib/repositories/promotion.repository";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

function toUiStatus(status: PrismaOrderStatus): OrderStatus {
  return status.toLowerCase() as OrderStatus;
}

function mapProductStatus(status: ProductStatus): BrandProductStatus {
  switch (status) {
    case "PUBLISHED":
      return "published";
    case "ARCHIVED":
      return "archived";
    default:
      return "draft";
  }
}

function mapBrandProduct(
  product: Awaited<ReturnType<typeof productRepository.listByBrand>>["items"][number],
): BrandProduct {
  const variant = product.variants[0];
  const media = product.media[0];
  const stock = product.variants.reduce((sum, v) => sum + (v.inventory?.available ?? 0), 0);
  const reserved = product.variants.reduce((sum, v) => sum + (v.inventory?.reserved ?? 0), 0);
  return {
    id: product.id,
    sku: variant?.sku ?? product.barcode ?? product.slug,
    name: product.name,
    slug: product.slug,
    status: mapProductStatus(product.status),
    category: product.category.name,
    price: Number(variant?.salePrice ?? variant?.price ?? 0),
    compareAt: variant?.salePrice ? Number(variant.price) : undefined,
    stock,
    reserved,
    sold30d: 0,
    revenue30d: 0,
    image: media?.url ?? FALLBACK_IMAGE,
    updatedAt: product.updatedAt.toISOString(),
  };
}

function mapBrandProductEditor(product: EditorProduct): BrandProductEditor {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    barcode: product.barcode,
    shortDescription: product.shortDescription,
    description: product.description,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    status: mapProductStatus(product.status),
    featured: product.featured,
    newArrival: product.newArrival,
    bestSeller: product.bestSeller,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      sizeLabel: variant.sizeLabel,
      price: Number(variant.price),
      salePrice: variant.salePrice == null ? null : Number(variant.salePrice),
      active: variant.active,
      sortOrder: variant.sortOrder,
      available: variant.inventory?.available ?? 0,
      reserved: variant.inventory?.reserved ?? 0,
      reorderLevel: variant.inventory?.reorderLevel ?? 5,
    })),
    media: product.media.map((item) => ({
      id: item.id,
      url: item.url,
      altText: item.altText,
      sortOrder: item.sortOrder,
      isPrimary: item.isPrimary,
    })),
    seo: {
      metaTitle: product.seo?.metaTitle ?? null,
      metaDescription: product.seo?.metaDescription ?? null,
      canonicalUrl: product.seo?.canonicalUrl ?? null,
      keywords: product.seo?.keywords ?? [],
    },
  };
}

function mapDemoProductEditor(product: BrandProduct): BrandProductEditor {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    barcode: null,
    shortDescription: null,
    description: null,
    categoryId: `demo-category-${product.category.toLowerCase().replace(/\s+/g, "-")}`,
    categoryName: product.category,
    status: product.status,
    featured: false,
    newArrival: false,
    bestSeller: false,
    variants: [
      {
        id: `${product.id}-variant-100`,
        sku: product.sku,
        sizeLabel: "100 ml",
        price: product.compareAt ?? product.price,
        salePrice: product.compareAt ? product.price : null,
        active: true,
        sortOrder: 0,
        available: Math.max(0, product.stock - product.reserved),
        reserved: product.reserved,
        reorderLevel: 5,
      },
    ],
    media: [
      {
        id: `${product.id}-media-1`,
        url: product.image,
        altText: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    seo: {
      metaTitle: product.name,
      metaDescription: null,
      canonicalUrl: `/products/${product.slug}`,
      keywords: [],
    },
  };
}

function mapBrandOrder(order: OrderWithRelations): BrandOrder {
  const user = order.customer?.user;
  return {
    orderNumber: order.orderNumber,
    placedAt: (order.placedAt ?? order.createdAt).toISOString(),
    status: toUiStatus(order.status),
    customerName: user ? `${user.firstName} ${user.lastName}`.trim() : "Customer",
    customerEmail: user?.email ?? "",
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    total: Number(order.total),
    currency: order.currency,
    items: order.items.map((item) => ({
      title: item.productName,
      variant: item.variantName ?? "",
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
  };
}

export async function getBrandWorkspace() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const brand = await brandRepository.findById(brandId);
      if (brand) {
        return {
          ...brandWorkspace,
          brandId: brand.id,
          brandName: brand.name,
          brandSlug: brand.slug,
        };
      }
    }
  } catch {
    // demo fallback
  }
  return brandWorkspace;
}

export async function getBrandDashboard() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const [products, inventory, orders] = await Promise.all([
        productRepository.listByBrand(brandId, { page: 1, pageSize: 50 }),
        inventoryRepository.listByBrand(brandId),
        orderRepository.listByBrand(brandId, 20),
      ]);

      const mappedInventory: BrandInventoryRow[] = inventory.map((row) => {
        const available = row.available;
        const status = available <= 0 ? "out" : available <= row.reorderLevel ? "low" : "healthy";
        return {
          id: row.id,
          variantId: row.variantId,
          productId: row.variant.productId,
          productName: row.variant.product.name,
          variant: row.variant.sizeLabel ?? row.variant.colorLabel ?? "Standard",
          sku: row.variant.sku,
          onHand: available + row.reserved,
          reserved: row.reserved,
          available,
          reorderAt: row.reorderLevel,
          status,
        };
      });

      const mappedOrders = orders.map(mapBrandOrder);
      const lowStock = mappedInventory.filter((row) => row.status === "low" || row.status === "out");
      const pending = mappedOrders.filter((o) =>
        ["paid", "processing", "packed", "confirmed"].includes(o.status),
      );

      return {
        workspace: await getBrandWorkspace(),
        analytics: {
          ...brandAnalytics,
          orders30d: mappedOrders.length,
          inventoryAlerts: lowStock.length,
          pendingShipments: pending.length,
        },
        recentOrders: mappedOrders.slice(0, 4),
        lowStock: lowStock.slice(0, 5),
        topProducts: products.items.slice(0, 5).map((p) => ({
          name: p.name,
          revenue: 0,
          units: 0,
        })),
        activity: brandActivityLogs.slice(0, 5),
        pendingShipments: pending.length,
      };
    }
  } catch {
    // demo fallback
  }

  const lowStock = brandInventory.filter((row) => row.status === "low" || row.status === "out");
  const pending = brandOrders.filter((o) =>
    ["paid", "processing", "packed", "confirmed"].includes(o.status),
  );
  return {
    workspace: brandWorkspace,
    analytics: brandAnalytics,
    recentOrders: brandOrders.slice(0, 4),
    lowStock: lowStock.slice(0, 5),
    topProducts: brandAnalytics.topProducts,
    activity: brandActivityLogs.slice(0, 5),
    pendingShipments: pending.length,
  };
}

export async function getBrandProducts() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const result = await productRepository.listByBrand(brandId, { page: 1, pageSize: 100 });
      if (result.items.length) return result.items.map(mapBrandProduct);
    }
  } catch {
    // demo fallback
  }
  return brandProducts;
}

export async function getBrandProduct(id: string) {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const product = await productRepository.findByIdForBrand(brandId, id);
      if (product) return mapBrandProduct(product);
      // Also allow slug lookup within brand
      const bySlug = await productRepository.listByBrand(brandId, { page: 1, pageSize: 100 });
      const match = bySlug.items.find((p) => p.slug === id);
      if (match) return mapBrandProduct(match);
      return null;
    }
  } catch {
    // demo fallback
  }
  const products = await getBrandProducts();
  return products.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getBrandProductEditor(id: string): Promise<BrandProductEditor | null> {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const product = await productRepository.findForBrandEditor(brandId, id);
      if (product) return mapBrandProductEditor(product);

      const bySlug = await productRepository.listByBrand(brandId, { page: 1, pageSize: 100 });
      const match = bySlug.items.find((p) => p.slug === id);
      if (match) {
        const detailed = await productRepository.findForBrandEditor(brandId, match.id);
        if (detailed) return mapBrandProductEditor(detailed);
      }
      return null;
    }
  } catch {
    // demo fallback
  }

  const product = brandProducts.find((p) => p.id === id || p.slug === id);
  return product ? mapDemoProductEditor(product) : null;
}

export async function getBrandCategoryOptions() {
  try {
    const categories = await categoryRepository.list();
    if (categories.length) {
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }));
    }
  } catch {
    // demo fallback
  }

  const names = Array.from(new Set(brandProducts.map((product) => product.category)));
  return names.map((name) => ({
    id: `demo-category-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function getBrandInventory() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const inventory = await inventoryRepository.listByBrand(brandId);
      if (inventory.length) {
        return inventory.map((row) => {
          const available = row.available;
          const status = available <= 0 ? "out" : available <= row.reorderLevel ? "low" : "healthy";
          return {
            id: row.id,
            variantId: row.variantId,
            productId: row.variant.productId,
            productName: row.variant.product.name,
            variant: row.variant.sizeLabel ?? row.variant.colorLabel ?? "Standard",
            sku: row.variant.sku,
            onHand: available + row.reserved,
            reserved: row.reserved,
            available,
            reorderAt: row.reorderLevel,
            status,
          } satisfies BrandInventoryRow;
        });
      }
    }
  } catch {
    // demo fallback
  }
  return brandInventory;
}

export async function getBrandOrders() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const orders = await orderRepository.listByBrand(brandId, 50);
      if (orders.length) return orders.map(mapBrandOrder);
    }
  } catch {
    // demo fallback
  }
  return brandOrders;
}

export async function getBrandOrder(orderNumber: string) {
  try {
    const brandId = await getSessionBrandId();
    if (!brandId) {
      // No assigned brand — never leak cross-tenant orders from Prisma
      return brandOrders.find((o) => o.orderNumber === orderNumber) ?? null;
    }

    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (order) {
      const itemBrandIds = order.items.map((i) => i.variant?.product?.brandId);
      if (orderBelongsToBrand(itemBrandIds, brandId)) {
        return mapBrandOrder(order);
      }
      return null;
    }
  } catch {
    // demo fallback
  }
  return brandOrders.find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function getBrandCoupons() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const coupons = await promotionRepository.listCouponsForBrand(brandId, 20);
      if (coupons.length) {
        const now = Date.now();
        return coupons.map((c) => {
          const starts = c.startsAt?.getTime() ?? c.promotion.startsAt.getTime();
          const ends = c.expiresAt?.getTime() ?? c.promotion.endsAt.getTime();
          let status: "active" | "scheduled" | "expired" = "active";
          if (ends < now || c.status === "EXPIRED") status = "expired";
          else if (starts > now) status = "scheduled";
          return {
            id: c.id,
            code: c.code,
            title: c.promotion.name,
            type: c.promotion.type as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
            value: Number(c.promotion.value),
            uses: c.usedCount,
            maxUses: c.usageLimit,
            status,
            startsAt: new Date(starts).toISOString(),
            endsAt: new Date(ends).toISOString(),
          };
        });
      }
    }
  } catch {
    // demo fallback
  }
  return brandCoupons;
}

export async function getBrandFlashSales() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const promos = await promotionRepository.listPromotionsForBrand(brandId, 20);
      const flash = promos.filter((p) => p.type === "PERCENTAGE");
      if (flash.length) {
        const now = Date.now();
        return flash.map((p) => {
          const starts = p.startsAt.getTime();
          const ends = p.endsAt.getTime();
          let status: "live" | "scheduled" | "ended" = "live";
          if (ends < now) status = "ended";
          else if (starts > now) status = "scheduled";
          return {
            id: p.id,
            title: p.name,
            status,
            startsAt: p.startsAt.toISOString(),
            endsAt: p.endsAt.toISOString(),
            discountPercent: Number(p.value),
            productCount: p.products.length || 0,
            revenue: 0,
            products: p.products.map((pp) => pp.productId),
          };
        });
      }
    }
  } catch {
    // demo fallback
  }
  return brandFlashSales;
}

export async function getBrandCustomers() {
  return brandCustomers;
}

export async function getBrandMedia() {
  return brandMedia;
}

export async function getBrandAnalytics() {
  return brandAnalytics;
}

export async function getBrandReports() {
  return brandReports;
}

export async function getBrandSettings() {
  return brandSettings;
}

export async function getBrandProfile() {
  try {
    const brandId = await getSessionBrandId();
    if (brandId) {
      const brand = await brandRepository.findById(brandId);
      if (brand) {
        return {
          ...brandProfile,
          brandName: brand.name,
          phone: brand.contactPhone ?? brandProfile.phone,
        };
      }
    }
  } catch {
    // demo fallback
  }
  return brandProfile;
}

export async function getBrandActivityLogs() {
  return brandActivityLogs;
}
