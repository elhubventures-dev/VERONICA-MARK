import type { OrderStatus } from "@/components/commerce/order-status-badge";

export type BrandProductStatus = "draft" | "published" | "archived";

export type BrandProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  status: BrandProductStatus;
  category: string;
  price: number;
  compareAt?: number;
  stock: number;
  reserved: number;
  sold30d: number;
  revenue30d: number;
  image: string;
  updatedAt: string;
};

export type BrandCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type BrandProductEditorVariant = {
  id: string;
  sku: string;
  sizeLabel: string | null;
  price: number;
  salePrice: number | null;
  active: boolean;
  sortOrder: number;
  available: number;
  reserved: number;
  reorderLevel: number;
};

export type BrandProductEditorMedia = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type BrandProductEditor = {
  id: string;
  name: string;
  slug: string;
  barcode: string | null;
  shortDescription: string | null;
  description: string | null;
  categoryId: string;
  categoryName: string;
  status: BrandProductStatus;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  variants: BrandProductEditorVariant[];
  media: BrandProductEditorMedia[];
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    keywords: string[];
  };
};

export type BrandInventoryRow = {
  id: string;
  /** Present for Prisma-backed rows; required for live stock mutations. */
  variantId?: string;
  productId: string;
  productName: string;
  variant: string;
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderAt: number;
  status: "healthy" | "low" | "out";
};

export type BrandOrder = {
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  currency: string;
  items: Array<{ title: string; variant: string; quantity: number; unitPrice: number }>;
};

export type BrandCoupon = {
  id: string;
  code: string;
  title: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  uses: number;
  maxUses: number | null;
  status: "active" | "scheduled" | "expired";
  startsAt: string;
  endsAt: string;
};

export type BrandFlashSale = {
  id: string;
  title: string;
  status: "live" | "scheduled" | "ended";
  startsAt: string;
  endsAt: string;
  discountPercent: number;
  productCount: number;
  revenue: number;
  products: string[];
};

export type BrandCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spend: number;
  lastOrderAt: string;
  city: string;
  country: string;
};

export type BrandMediaAsset = {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  sizeKb: number;
  usedOn: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type BrandActivityLog = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  recordId: string;
  summary: string;
  createdAt: string;
};

export type BrandReport = {
  id: string;
  title: string;
  description: string;
  format: "CSV" | "XLSX" | "PDF";
  lastGeneratedAt: string;
  href: string;
};

/** Empty façades — brand portal renders Prisma data or empty states. */
export const brandWorkspace = {
  brandId: "",
  brandName: "",
  brandSlug: "",
  managerName: "",
  managerEmail: "",
  currency: "NGN",
  timezone: "Africa/Lagos",
};

export const brandProducts: BrandProduct[] = [];
export const brandInventory: BrandInventoryRow[] = [];
export const brandOrders: BrandOrder[] = [];
export const brandCoupons: BrandCoupon[] = [];
export const brandFlashSales: BrandFlashSale[] = [];
export const brandCustomers: BrandCustomer[] = [];
export const brandMedia: BrandMediaAsset[] = [];
export const brandActivityLogs: BrandActivityLog[] = [];
export const brandReports: BrandReport[] = [];

export const brandAnalytics = {
  salesToday: 0,
  ordersToday: 0,
  revenue30d: 0,
  orders30d: 0,
  aov30d: 0,
  conversionRate: 0,
  pendingShipments: 0,
  inventoryAlerts: 0,
  revenueSeries: [] as Array<{ day: string; revenue: number; orders: number }>,
  categoryMix: [] as Array<{ name: string; value: number }>,
  topProducts: [] as Array<{ name: string; units: number; revenue: number }>,
};

export const brandSettings = {
  notifyLowStock: true,
  notifyNewOrders: true,
  notifyFlashSale: true,
  autoPublishReviews: false,
  defaultCurrency: "NGN",
  fulfillmentSlaHours: 48,
};

export const brandProfile = {
  name: "",
  email: "",
  title: "Brand Manager",
  phone: "",
  brandName: "",
  timezone: "Africa/Lagos",
  language: "English",
};
