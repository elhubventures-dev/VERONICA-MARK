import "server-only";

import { brandRepository } from "@/lib/repositories/brand.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { orderRepository } from "@/lib/repositories/order.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { promotionRepository } from "@/lib/repositories/promotion.repository";
import {
  CATALOG_PAGE_SIZE,
  demoBrands,
  demoCategories,
  demoCoupons,
  demoOrders,
  demoProductDetails,
  demoProducts,
  getDemoProductBySlug,
  getDemoProductsByBrand,
  getDemoProductsByCategory,
  getFlashSaleProducts,
  type DemoOrder,
  type SortValue,
  type StorefrontBrand,
  type StorefrontCategory,
  type StorefrontProduct,
  type StorefrontProductDetail,
} from "@/lib/storefront/demo-catalog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

/** Fallback catalog price ceiling when the live catalog has no priced products (NGN). */
const NGN_PRICE_FACET_FALLBACK_MAX = 500_000;

/** Max products loaded when sort/price must be applied across the full result set. */
const CATALOG_FULL_SCAN_LIMIT = 10_000;

type SortableStorefrontProduct = StorefrontProduct & {
  /** Epoch ms for newest sort; omitted on demo items that lack dates. */
  publishedAtMs?: number;
};

export type CatalogFilters = {
  brand?: string[];
  category?: string[];
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: SortValue;
  page?: number;
  pageSize?: number;
};

/**
 * Drop price bounds that cannot match any catalog amount (e.g. leftover EUR-scale
 * `priceMax=300` against NGN prices in the tens of thousands).
 */
export function sanitizeCatalogPriceFilters(
  filters: Pick<CatalogFilters, "priceMin" | "priceMax">,
  priceRange: { min: number; max: number },
): Pick<CatalogFilters, "priceMin" | "priceMax"> {
  const span = priceRange.max - priceRange.min;
  const min = filters.priceMin;
  const max = filters.priceMax;
  const minOk =
    min === undefined ||
    (Number.isFinite(min) && min >= priceRange.min - span && min <= priceRange.max);
  const maxOk =
    max === undefined ||
    (Number.isFinite(max) && max >= priceRange.min && max <= priceRange.max + span);
  return {
    priceMin: minOk ? min : undefined,
    priceMax: maxOk ? max : undefined,
  };
}

export type CatalogResult = {
  items: StorefrontProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function mapDbProduct(
  product: NonNullable<Awaited<ReturnType<typeof productRepository.findBySlug>>>,
): SortableStorefrontProduct {
  const firstVariant = product.variants[0];
  const firstMedia = product.media[0];
  const stock = product.variants.reduce((sum, v) => sum + (v.inventory?.available ?? 0), 0);
  const inStock = stock > 0;
  const badge = product.featured
    ? "exclusive"
    : product.bestSeller
      ? "bestseller"
      : product.newArrival
        ? "new"
        : firstVariant?.salePrice
          ? "limited"
          : undefined;
  const publishedAtMs = product.publishedAt?.getTime() ?? product.createdAt.getTime();
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand.name,
    brandSlug: product.brand.slug,
    category: product.category.name,
    categorySlug: product.category.slug,
    price: Number(firstVariant?.salePrice ?? firstVariant?.price ?? 0),
    compareAt: firstVariant?.salePrice ? Number(firstVariant.price) : undefined,
    image: firstMedia?.url ?? FALLBACK_IMAGE,
    badge,
    inStock,
    stock,
    defaultVariantId: firstVariant?.id,
    defaultVariantLabel: firstVariant?.sizeLabel ?? firstVariant?.colorLabel ?? "Standard",
    publishedAtMs,
  };
}

function sortProducts(
  products: SortableStorefrontProduct[],
  sort: SortValue = "featured",
): SortableStorefrontProduct[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return copy.sort((a, b) => {
        const byDate = (b.publishedAtMs ?? 0) - (a.publishedAtMs ?? 0);
        if (byDate !== 0) return byDate;
        return b.slug.localeCompare(a.slug);
      });
    default:
      return copy;
  }
}

function requiresFullCatalogScan(filters: CatalogFilters): boolean {
  const sort = filters.sort ?? "featured";
  return (
    sort === "price-asc" ||
    sort === "price-desc" ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined
  );
}

function filterDemoProducts(filters: CatalogFilters): StorefrontProduct[] {
  let items = [...demoProducts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (filters.brand?.length) {
    items = items.filter((p) => filters.brand!.includes(p.brandSlug));
  }

  if (filters.category?.length) {
    items = items.filter((p) => filters.category!.includes(p.categorySlug));
  }

  if (filters.priceMin !== undefined) {
    items = items.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    items = items.filter((p) => p.price <= filters.priceMax!);
  }

  return sortProducts(items, filters.sort);
}

function paginateProducts(items: StorefrontProduct[], page: number, pageSize: number): CatalogResult {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function applyClientPriceFilter(items: StorefrontProduct[], filters: CatalogFilters): StorefrontProduct[] {
  let next = items;
  if (filters.priceMin !== undefined) {
    next = next.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    next = next.filter((p) => p.price <= filters.priceMax!);
  }
  return next;
}

export async function queryCatalog(filters: CatalogFilters = {}): Promise<CatalogResult> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? CATALOG_PAGE_SIZE;
  const sort = filters.sort ?? "featured";

  try {
    const [brandIds, categoryIds] = await Promise.all([
      brandRepository.resolveIdsBySlugs(filters.brand ?? []),
      categoryRepository.resolveIdsBySlugs(filters.category ?? []),
    ]);

    // If slugs were provided but none resolved, fall through to demo (mixed catalogs).
    if ((filters.brand?.length && !brandIds.length) || (filters.category?.length && !categoryIds.length)) {
      return paginateProducts(filterDemoProducts(filters), page, pageSize);
    }

    const listFilters = {
      search: filters.search,
      brandIds: brandIds.length ? brandIds : undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      sort,
    };

    // Price lives on variants and price filters are applied after mapping, so those
    // paths must load the full matching set, sort, then paginate — otherwise only
    // the current page is reordered and later pages stay in the wrong order.
    if (requiresFullCatalogScan(filters)) {
      const result = await productRepository.listPublished(
        { page: 1, pageSize: CATALOG_FULL_SCAN_LIMIT },
        listFilters,
      );
      const mapped = applyClientPriceFilter(
        result.items.map((p) => mapDbProduct(p)),
        filters,
      );
      return paginateProducts(sortProducts(mapped, sort), page, pageSize);
    }

    const result = await productRepository.listPublished({ page, pageSize }, listFilters);

    // Trust a successful DB query — empty brand/category results mean empty, not demo filler.
    return {
      items: result.items.map((p) => mapDbProduct(p)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  } catch {
    // fall through to demo catalog
  }

  return paginateProducts(filterDemoProducts(filters), page, pageSize);
}

export async function getProductDetail(slug: string): Promise<StorefrontProductDetail | null> {
  try {
    const product = await productRepository.findBySlug(slug);
    if (product && product.status === "PUBLISHED") {
      const mapped = mapDbProduct(product);

      const variants = product.variants.map((v) => {
        const stock = v.inventory?.available ?? 0;
        return {
          id: v.id,
          label: v.sizeLabel ?? v.colorLabel ?? "Standard",
          price: Number(v.salePrice ?? v.price),
          compareAt: v.salePrice ? Number(v.price) : undefined,
          available: stock > 0,
          stock,
        };
      });

      const images = product.media.length
        ? product.media.map((m) => ({ src: m.url, alt: m.altText ?? product.name }))
        : [{ src: mapped.image, alt: product.name }];

      let relatedSlugs: string[] = [];
      try {
        const related = await productRepository.listPublished(
          { page: 1, pageSize: 5 },
          { brandId: product.brandId },
        );
        relatedSlugs = related.items.filter((p) => p.slug !== slug).slice(0, 4).map((p) => p.slug);
      } catch {
        relatedSlugs = demoProductDetails
          .filter((p) => p.brandSlug === mapped.brandSlug && p.slug !== slug)
          .slice(0, 4)
          .map((p) => p.slug);
      }

      return {
        ...mapped,
        description: product.description ?? product.shortDescription ?? "",
        images,
        variants: variants.length ? variants : getDemoProductBySlug(slug)?.variants ?? [],
        specs: [
          { label: "Concentration", value: "Eau de Parfum" },
          { label: "House", value: mapped.brand },
          { label: "Category", value: mapped.category },
          { label: "SKU", value: product.barcode ?? product.slug },
        ],
        reviews: getDemoProductBySlug(slug)?.reviews ?? [],
        relatedSlugs,
      };
    }
  } catch {
    // demo fallback
  }

  return getDemoProductBySlug(slug) ?? null;
}

const HOUSE_BRAND_SLUG = "vma-scents";

function sortHouseBrandFirst(brands: StorefrontBrand[]): StorefrontBrand[] {
  return [...brands].sort((a, b) => {
    if (a.slug === HOUSE_BRAND_SLUG) return -1;
    if (b.slug === HOUSE_BRAND_SLUG) return 1;
    return a.name.localeCompare(b.name);
  });
}

function brandImage(brand: { slug: string; logo: string | null }, index = 0): string {
  if (brand.logo) return brand.logo;
  const bySlug = demoBrands.find((b) => b.slug === brand.slug)?.image;
  return bySlug ?? demoBrands[index % demoBrands.length]?.image ?? FALLBACK_IMAGE;
}

export async function getBrands(): Promise<StorefrontBrand[]> {
  try {
    const result = await brandRepository.list({ page: 1, pageSize: 24 });
    if (result.items.length) {
      return sortHouseBrandFirst(
        result.items.map((brand, index) => ({
          id: brand.id,
          slug: brand.slug,
          name: brand.name,
          description: brand.description ?? "A distinctive house in the VERONICA MARK edit.",
          image: brandImage(brand, index),
        })),
      );
    }
  } catch {
    // demo fallback
  }
  return sortHouseBrandFirst(demoBrands);
}

export async function getBrandDetail(slug: string): Promise<StorefrontBrand | null> {
  try {
    const brand = await brandRepository.findBySlug(slug);
    if (brand) {
      return {
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
        description: brand.description ?? "A distinctive house in the VERONICA MARK edit.",
        image: brandImage(brand),
      };
    }
  } catch {
    // demo fallback
  }
  return demoBrands.find((b) => b.slug === slug) ?? null;
}

export async function getBrandProducts(slug: string, filters: Omit<CatalogFilters, "brand"> = {}): Promise<CatalogResult> {
  try {
    const brand = await brandRepository.findBySlug(slug);
    if (brand) {
      return queryCatalog({ ...filters, brand: [brand.slug] });
    }
  } catch {
    // demo fallback
  }

  const items = getDemoProductsByBrand(slug);
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? CATALOG_PAGE_SIZE;
  return paginateProducts(sortProducts(items, filters.sort), page, pageSize);
}

export async function getCategories(): Promise<StorefrontCategory[]> {
  try {
    const categories = await categoryRepository.list({ featuredOnly: false });
    if (categories.length) {
      return categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description ?? "Explore the curated VERONICA MARK edit.",
        image: c.image ?? FALLBACK_IMAGE,
      }));
    }
  } catch {
    // demo fallback
  }
  return demoCategories;
}

export async function getCategoryDetail(slug: string): Promise<StorefrontCategory | null> {
  try {
    const category = await categoryRepository.findBySlug(slug);
    if (category) {
      return {
        slug: category.slug,
        name: category.name,
        description: category.description ?? "Explore the curated VERONICA MARK edit.",
        image: category.image ?? FALLBACK_IMAGE,
      };
    }
  } catch {
    // demo fallback
  }
  return demoCategories.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryProducts(slug: string, filters: Omit<CatalogFilters, "category"> = {}): Promise<CatalogResult> {
  try {
    const category = await categoryRepository.findBySlug(slug);
    if (category) {
      return queryCatalog({ ...filters, category: [category.slug] });
    }
  } catch {
    // demo fallback
  }

  const items = getDemoProductsByCategory(slug);
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? CATALOG_PAGE_SIZE;
  return paginateProducts(sortProducts(items, filters.sort), page, pageSize);
}

export async function searchCatalog(query: string, filters: CatalogFilters = {}): Promise<CatalogResult> {
  return queryCatalog({ ...filters, search: query });
}

export async function getFlashSaleCatalog(): Promise<StorefrontProduct[]> {
  try {
    const promos = await promotionRepository.findActivePromotions();
    if (promos.length) {
      const featuredResult = await productRepository.listPublished(
        { page: 1, pageSize: 50 },
        { featured: true },
      );
      if (featuredResult.items.length >= 24) {
        return featuredResult.items.map((p) => mapDbProduct(p));
      }
    }

    const result = await productRepository.listPublished({ page: 1, pageSize: 50 });
    if (result.items.length) {
      const saleFirst = result.items
        .map((p) => mapDbProduct(p))
        .sort((a, b) => {
          const aPriority = Number(Boolean(a.compareAt || a.badge === "exclusive" || a.badge === "limited"));
          const bPriority = Number(Boolean(b.compareAt || b.badge === "exclusive" || b.badge === "limited"));
          return bPriority - aPriority;
        });
      if (saleFirst.length) {
        return saleFirst;
      }
    }

    if (promos.length) {
      const featuredResult = await productRepository.listPublished(
        { page: 1, pageSize: 24 },
        { featured: true },
      );
      if (featuredResult.items.length) {
        return featuredResult.items.map((p) => mapDbProduct(p));
      }
    }
  } catch {
    // demo fallback
  }

  try {
    const result = await queryCatalog({ page: 1, pageSize: 50, sort: "featured" });
    if (result.items.length) {
      return result.items.map((product, index) => ({
        ...product,
        flashSale: index < 12 || product.flashSale,
      }));
    }
  } catch {
    // demo fallback
  }

  const demoSale = getFlashSaleProducts();
  if (demoSale.length >= 4) {
    return demoSale;
  }

  if (demoProducts.length) {
    return demoProducts.slice(0, Math.min(50, demoProducts.length)).map((product, index) => ({
      ...product,
      flashSale: index < 4 || product.flashSale,
    }));
  }
  return [];
}

export async function validateCouponCode(code: string) {
  try {
    const coupon = await promotionRepository.findActiveByCouponCode(code);
    if (coupon?.promotion) {
      return {
        code: coupon.code,
        type: coupon.promotion.type as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
        value: Number(coupon.promotion.value),
      };
    }
  } catch {
    // demo fallback
  }

  const demo = demoCoupons[code.toUpperCase()];
  if (demo) {
    return { code: code.toUpperCase(), ...demo };
  }
  return null;
}

export async function getOrderForInvoice(orderNumber: string): Promise<DemoOrder | null> {
  try {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (order) {
      return {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        email: order.customer?.user?.email ?? "guest@example.com",
        status: (["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
          ? order.status
          : order.status === "PAID" || order.status === "PENDING"
            ? "CONFIRMED"
            : "PROCESSING") as DemoOrder["status"],
        shippingAddress: order.shippingAddress as DemoOrder["shippingAddress"],
        items: order.items.map((item) => ({
          title: item.productName,
          brand: item.variant?.product?.brand?.name ?? "",
          variant: item.variantName ?? "",
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shippingFee),
        discount: Number(order.discount),
        total: Number(order.total),
        currency: order.currency,
      };
    }
  } catch {
    // demo fallback
  }
  return demoOrders[orderNumber] ?? demoOrders["VM-2026-0001"] ?? null;
}

export async function getFilterFacets() {
  try {
    const [brands, categories, catalog] = await Promise.all([
      brandRepository.list({ page: 1, pageSize: 50 }),
      categoryRepository.list(),
      productRepository.listPublished({ page: 1, pageSize: 200 }),
    ]);

    if (brands.items.length || categories.length) {
      const products = catalog.items.map((p) => mapDbProduct(p));
      const prices = products.map((p) => p.price);
      return {
        brands: brands.items.map((b) => ({
          value: b.slug,
          label: b.name,
          count: products.filter((p) => p.brandSlug === b.slug).length,
        })),
        categories: categories.map((c) => ({
          value: c.slug,
          label: c.name,
          count: products.filter((p) => p.categorySlug === c.slug).length,
        })),
        priceRange: {
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : NGN_PRICE_FACET_FALLBACK_MAX,
        },
      };
    }
  } catch {
    // demo fallback
  }

  const demoPrices = demoProducts.map((p) => p.price);
  return {
    brands: demoBrands.map((b) => ({
      value: b.slug,
      label: b.name,
      count: demoProducts.filter((p) => p.brandSlug === b.slug).length,
    })),
    categories: demoCategories.map((c) => ({
      value: c.slug,
      label: c.name,
      count: demoProducts.filter((p) => p.categorySlug === c.slug).length,
    })),
    priceRange: {
      min: demoPrices.length ? Math.min(...demoPrices) : 0,
      max: demoPrices.length ? Math.max(...demoPrices) : NGN_PRICE_FACET_FALLBACK_MAX,
    },
  };
}
