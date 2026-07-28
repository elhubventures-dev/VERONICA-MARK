export type ProductBadge = "new" | "limited" | "exclusive" | "bestseller";

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAt?: number;
  image: string;
  badge?: ProductBadge;
  flashSale?: boolean;
  /** False when no sellable stock; product still appears as out of stock. */
  inStock?: boolean;
  /** Units available to sell (primary / first variant). */
  stock?: number;
  /** Primary variant for quick-add from catalog cards. */
  defaultVariantId?: string;
  defaultVariantLabel?: string;
};

export type StorefrontVariant = {
  id: string;
  label: string;
  price: number;
  compareAt?: number;
  available: boolean;
  /** Units currently available for this variant. */
  stock: number;
};

export type StorefrontReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type StorefrontProductDetail = StorefrontProduct & {
  description: string;
  images: { src: string; alt: string }[];
  variants: StorefrontVariant[];
  specs: { label: string; value: string }[];
  reviews: StorefrontReview[];
  relatedSlugs: string[];
};

export type StorefrontBrand = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type StorefrontCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type DemoOrderLine = {
  title: string;
  brand: string;
  variant: string;
  quantity: number;
  unitPrice: number;
};

export type DemoOrder = {
  orderNumber: string;
  createdAt: string;
  email: string;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: DemoOrderLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
};

/** Opening promo window — dates/copy only; catalog comes from Prisma. */
export const OPENING_DISCOUNT_PERCENT = 20;
export const OPENING_COUPON_CODE = "VM5AUG-20";

/** Empty façades — storefront renders Prisma catalog or empty states. */
export const demoBrands: StorefrontBrand[] = [];
export const demoProducts: StorefrontProduct[] = [];
export const demoProductDetails: StorefrontProductDetail[] = [];
export const demoOrders: Record<string, DemoOrder> = {};
export const demoCoupons: Record<string, { type: "PERCENTAGE" | "FIXED_AMOUNT"; value: number }> = {};

export const demoCategories: StorefrontCategory[] = [
  {
    slug: "perfumes",
    name: "Perfumes",
    description: "The complete fragrance wardrobe",
    image:
      "https://kxxdhqzkkbhkqaampdfe.supabase.co/storage/v1/object/public/veronica-mark-media/categories/perfumes.png",
  },
  {
    slug: "women",
    name: "Women",
    description: "Floral, amber and luminous signatures",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "men",
    name: "Men",
    description: "Woods, aromatics and refined freshness",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85",
  },
];

export function getDemoProductBySlug(_slug: string): StorefrontProductDetail | undefined {
  return undefined;
}

export function getDemoProductsByBrand(_brandSlug: string): StorefrontProduct[] {
  return [];
}

export function getDemoProductsByCategory(_categorySlug: string): StorefrontProduct[] {
  return [];
}

export function getFlashSaleProducts(): StorefrontProduct[] {
  return [];
}

export const flashSale = {
  title: "Private Opening Edit",
  description:
    "A carefully selected opening collection with exclusive pricing on signature compositions — presented with the same curation as the full edit.",
  discountPercent: OPENING_DISCOUNT_PERCENT,
  couponCode: OPENING_COUPON_CODE,
  startsAt: "2026-08-01T00:00:00+01:00",
  endsAt: "2026-08-07T23:59:59+01:00",
};

export const CATALOG_PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "newest", label: "Newest" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
