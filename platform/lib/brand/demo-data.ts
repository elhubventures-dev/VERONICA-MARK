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

export const brandWorkspace = {
  brandId: "brand-atelier",
  brandName: "VERONICA MARK Atelier",
  brandSlug: "veronica-mark-atelier",
  managerName: "Amara Okafor",
  managerEmail: "brand.manager@veronicamark.com",
  currency: "EUR",
  timezone: "Europe/Paris",
};

export const brandProducts: BrandProduct[] = [
  {
    id: "prod-velvet-iris",
    sku: "VM-VI-100",
    name: "Velvet Iris",
    slug: "velvet-iris",
    status: "published",
    category: "Women",
    price: 165,
    stock: 42,
    reserved: 3,
    sold30d: 28,
    revenue30d: 4620,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-22T10:00:00+01:00",
  },
  {
    id: "prod-nocturne-oud",
    sku: "VM-NO-100",
    name: "Nocturne Oud",
    slug: "nocturne-oud",
    status: "published",
    category: "Men",
    price: 210,
    compareAt: 245,
    stock: 8,
    reserved: 2,
    sold30d: 19,
    revenue30d: 3990,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-21T16:20:00+01:00",
  },
  {
    id: "prod-soleil-neroli",
    sku: "VM-SN-100",
    name: "Soleil Néroli",
    slug: "soleil-neroli",
    status: "published",
    category: "Women",
    price: 148,
    stock: 56,
    reserved: 1,
    sold30d: 34,
    revenue30d: 5032,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-20T09:10:00+01:00",
  },
  {
    id: "prod-purple-reign",
    sku: "VM-PR-100",
    name: "Purple Reign",
    slug: "purple-reign",
    status: "published",
    category: "Perfumes",
    price: 195,
    stock: 0,
    reserved: 0,
    sold30d: 12,
    revenue30d: 2340,
    image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-19T14:00:00+01:00",
  },
  {
    id: "prod-santal-minuit",
    sku: "VM-SM-100",
    name: "Santal Minuit",
    slug: "santal-minuit",
    status: "draft",
    category: "Men",
    price: 180,
    stock: 20,
    reserved: 0,
    sold30d: 0,
    revenue30d: 0,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-18T11:30:00+01:00",
  },
  {
    id: "prod-figue-dor",
    sku: "VM-FD-100",
    name: "Figue d'Or",
    slug: "figue-dor",
    status: "published",
    category: "Perfumes",
    price: 155,
    stock: 31,
    reserved: 4,
    sold30d: 15,
    revenue30d: 2325,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85",
    updatedAt: "2026-07-17T08:45:00+01:00",
  },
];

export const brandInventory: BrandInventoryRow[] = brandProducts.flatMap((product) => {
  const available = Math.max(0, product.stock - product.reserved);
  const status = available === 0 ? "out" : available <= 10 ? "low" : "healthy";
  return [
    {
      id: `${product.id}-100`,
      productId: product.id,
      productName: product.name,
      variant: "100 ml",
      sku: product.sku,
      onHand: product.stock,
      reserved: product.reserved,
      available,
      reorderAt: 12,
      status,
    },
    {
      id: `${product.id}-50`,
      productId: product.id,
      productName: product.name,
      variant: "50 ml",
      sku: product.sku.replace("100", "50"),
      onHand: Math.max(0, Math.floor(product.stock * 0.7)),
      reserved: Math.max(0, Math.floor(product.reserved * 0.5)),
      available: Math.max(0, Math.floor(product.stock * 0.7) - Math.floor(product.reserved * 0.5)),
      reorderAt: 10,
      status:
        Math.floor(product.stock * 0.7) - Math.floor(product.reserved * 0.5) <= 0
          ? "out"
          : Math.floor(product.stock * 0.7) - Math.floor(product.reserved * 0.5) <= 8
            ? "low"
            : "healthy",
    },
  ];
});

export const brandOrders: BrandOrder[] = [
  {
    orderNumber: "VM-2026-0004",
    placedAt: "2026-07-22T09:14:00+01:00",
    status: "shipped",
    customerName: "Camille Dubois",
    customerEmail: "customer@example.com",
    itemCount: 1,
    total: 210,
    currency: "EUR",
    items: [{ title: "Ambre Soie", variant: "100 ml", quantity: 1, unitPrice: 175 }],
  },
  {
    orderNumber: "VM-2026-0001",
    placedAt: "2026-07-20T14:32:00+01:00",
    status: "processing",
    customerName: "Camille Dubois",
    customerEmail: "customer@example.com",
    itemCount: 2,
    total: 359.6,
    currency: "EUR",
    items: [
      { title: "Velvet Iris", variant: "100 ml", quantity: 1, unitPrice: 165 },
      { title: "Nocturne Oud", variant: "50 ml", quantity: 1, unitPrice: 151 },
    ],
  },
  {
    orderNumber: "VM-2026-0010",
    placedAt: "2026-07-23T18:02:00+01:00",
    status: "paid",
    customerName: "Louis Moreau",
    customerEmail: "louis@example.com",
    itemCount: 1,
    total: 177.6,
    currency: "EUR",
    items: [{ title: "Soleil Néroli", variant: "100 ml", quantity: 1, unitPrice: 148 }],
  },
  {
    orderNumber: "VM-2026-0008",
    placedAt: "2026-07-18T12:40:00+01:00",
    status: "delivered",
    customerName: "Nora Ellis",
    customerEmail: "nora@example.com",
    itemCount: 1,
    total: 234,
    currency: "EUR",
    items: [{ title: "Purple Reign", variant: "100 ml", quantity: 1, unitPrice: 195 }],
  },
  {
    orderNumber: "VM-2026-0006",
    placedAt: "2026-07-15T09:05:00+01:00",
    status: "packed",
    customerName: "James Laurent",
    customerEmail: "james@example.com",
    itemCount: 2,
    total: 402,
    currency: "EUR",
    items: [
      { title: "Nocturne Oud", variant: "100 ml", quantity: 1, unitPrice: 210 },
      { title: "Figue d'Or", variant: "100 ml", quantity: 1, unitPrice: 155 },
    ],
  },
];

export const brandCoupons: BrandCoupon[] = [
  {
    id: "cpn-1",
    code: "VM5AUG-20",
    title: "August Grand Opening",
    type: "PERCENTAGE",
    value: 20,
    uses: 412,
    maxUses: 5000,
    status: "active",
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
  },
  {
    id: "cpn-1b",
    code: "GRANDOPEN",
    title: "Grand Opening",
    type: "PERCENTAGE",
    value: 20,
    uses: 148,
    maxUses: 500,
    status: "active",
    startsAt: "2026-07-01T00:00:00+01:00",
    endsAt: "2026-08-31T23:59:59+01:00",
  },
  {
    id: "cpn-2",
    code: "ATELIER15",
    title: "Atelier private",
    type: "FIXED_AMOUNT",
    value: 15,
    uses: 22,
    maxUses: 100,
    status: "active",
    startsAt: "2026-07-10T00:00:00+01:00",
    endsAt: "2026-09-30T23:59:59+01:00",
  },
  {
    id: "cpn-3",
    code: "FREESHIP-AUG",
    title: "August delivery",
    type: "FREE_SHIPPING",
    value: 0,
    uses: 0,
    maxUses: null,
    status: "scheduled",
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-15T23:59:59+01:00",
  },
];

export const brandFlashSales: BrandFlashSale[] = [
  {
    id: "fs-1",
    title: "August Grand Opening Flash Sale",
    status: "scheduled",
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
    discountPercent: 15,
    productCount: 4,
    revenue: 12840,
    products: ["Velvet Iris", "Nocturne Oud", "Soleil Néroli", "Purple Reign"],
  },
  {
    id: "fs-2",
    title: "After Dark Weekend",
    status: "scheduled",
    startsAt: "2026-08-15T18:00:00+01:00",
    endsAt: "2026-08-17T23:59:59+01:00",
    discountPercent: 20,
    productCount: 3,
    revenue: 0,
    products: ["Nocturne Oud", "Santal Minuit", "Ambre Soie"],
  },
];

export const brandCustomers: BrandCustomer[] = [
  {
    id: "cust-1",
    name: "Camille Dubois",
    email: "customer@example.com",
    orders: 4,
    spend: 973.7,
    lastOrderAt: "2026-07-22T09:14:00+01:00",
    city: "Paris",
    country: "France",
  },
  {
    id: "cust-2",
    name: "Louis Moreau",
    email: "louis@example.com",
    orders: 2,
    spend: 388.2,
    lastOrderAt: "2026-07-23T18:02:00+01:00",
    city: "Lyon",
    country: "France",
  },
  {
    id: "cust-3",
    name: "Nora Ellis",
    email: "nora@example.com",
    orders: 1,
    spend: 234,
    lastOrderAt: "2026-07-18T12:40:00+01:00",
    city: "London",
    country: "United Kingdom",
  },
  {
    id: "cust-4",
    name: "James Laurent",
    email: "james@example.com",
    orders: 3,
    spend: 712.5,
    lastOrderAt: "2026-07-15T09:05:00+01:00",
    city: "Brussels",
    country: "Belgium",
  },
];

export const brandMedia: BrandMediaAsset[] = [
  {
    id: "media-1",
    name: "velvet-iris-hero.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    sizeKb: 420,
    usedOn: "Velvet Iris PDP",
    uploadedAt: "2026-07-01T10:00:00+01:00",
    uploadedBy: "Amara Okafor",
  },
  {
    id: "media-2",
    name: "nocturne-oud-detail.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    sizeKb: 380,
    usedOn: "Nocturne Oud PDP",
    uploadedAt: "2026-07-02T11:20:00+01:00",
    uploadedBy: "Amara Okafor",
  },
  {
    id: "media-3",
    name: "atelier-lookbook.pdf",
    type: "document",
    url: "#",
    sizeKb: 2400,
    usedOn: "Brand assets",
    uploadedAt: "2026-06-15T09:00:00+01:00",
    uploadedBy: "Amara Okafor",
  },
  {
    id: "media-4",
    name: "flash-sale-banner.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85",
    sizeKb: 610,
    usedOn: "Flash sale campaign",
    uploadedAt: "2026-07-19T16:00:00+01:00",
    uploadedBy: "Amara Okafor",
  },
];

export const brandActivityLogs: BrandActivityLog[] = [
  {
    id: "log-1",
    actor: "Amara Okafor",
    action: "PRODUCT.UPDATE",
    resource: "Product",
    recordId: "prod-nocturne-oud",
    summary: "Updated sale price on Nocturne Oud",
    createdAt: "2026-07-21T16:20:00+01:00",
  },
  {
    id: "log-2",
    actor: "Amara Okafor",
    action: "INVENTORY.ADJUST",
    resource: "Inventory",
    recordId: "prod-purple-reign-100",
    summary: "Marked Purple Reign 100 ml out of stock",
    createdAt: "2026-07-19T14:05:00+01:00",
  },
  {
    id: "log-3",
    actor: "System",
    action: "ORDER.STATUS",
    resource: "Order",
    recordId: "VM-2026-0004",
    summary: "Order VM-2026-0004 marked shipped",
    createdAt: "2026-07-23T11:02:00+01:00",
  },
  {
    id: "log-4",
    actor: "Amara Okafor",
    action: "PROMOTION.CREATE",
    resource: "Coupon",
    recordId: "cpn-2",
    summary: "Created coupon ATELIER15",
    createdAt: "2026-07-10T09:30:00+01:00",
  },
  {
    id: "log-5",
    actor: "Amara Okafor",
    action: "FLASH_SALE.PUBLISH",
    resource: "FlashSale",
    recordId: "fs-1",
    summary: "Published August Grand Opening Flash Sale",
    createdAt: "2026-07-20T00:05:00+01:00",
  },
  {
    id: "log-6",
    actor: "Amara Okafor",
    action: "MEDIA.UPLOAD",
    resource: "MediaAsset",
    recordId: "media-4",
    summary: "Uploaded flash-sale-banner.jpg",
    createdAt: "2026-07-19T16:00:00+01:00",
  },
];

export const brandReports: BrandReport[] = [
  {
    id: "rep-1",
    title: "Sales summary (30 days)",
    description: "Gross revenue, orders, AOV, and top SKUs for your brand.",
    format: "XLSX",
    lastGeneratedAt: "2026-07-23T08:00:00+01:00",
    href: "#",
  },
  {
    id: "rep-2",
    title: "Inventory valuation",
    description: "On-hand units and estimated retail value by variant.",
    format: "CSV",
    lastGeneratedAt: "2026-07-22T07:30:00+01:00",
    href: "#",
  },
  {
    id: "rep-3",
    title: "Flash sale performance",
    description: "Discount impact, conversion, and units moved.",
    format: "PDF",
    lastGeneratedAt: "2026-07-21T18:00:00+01:00",
    href: "#",
  },
  {
    id: "rep-4",
    title: "Customer cohort",
    description: "Repeat purchase rate and spend by country.",
    format: "CSV",
    lastGeneratedAt: "2026-07-15T09:00:00+01:00",
    href: "#",
  },
];

export const brandAnalytics = {
  salesToday: 177.6,
  ordersToday: 1,
  revenue30d: 18307,
  orders30d: 48,
  aov30d: 381.4,
  conversionRate: 3.2,
  pendingShipments: 3,
  inventoryAlerts: brandInventory.filter((row) => row.status !== "healthy").length,
  revenueSeries: [
    { day: "17 Jul", revenue: 420, orders: 2 },
    { day: "18 Jul", revenue: 890, orders: 4 },
    { day: "19 Jul", revenue: 610, orders: 3 },
    { day: "20 Jul", revenue: 1240, orders: 5 },
    { day: "21 Jul", revenue: 980, orders: 4 },
    { day: "22 Jul", revenue: 1510, orders: 6 },
    { day: "23 Jul", revenue: 760, orders: 3 },
  ],
  categoryMix: [
    { name: "Women", value: 42 },
    { name: "Men", value: 33 },
    { name: "Perfumes", value: 25 },
  ],
  topProducts: [
    { name: "Soleil Néroli", units: 34, revenue: 5032 },
    { name: "Velvet Iris", units: 28, revenue: 4620 },
    { name: "Nocturne Oud", units: 19, revenue: 3990 },
    { name: "Purple Reign", units: 12, revenue: 2340 },
  ],
};

export const brandSettings = {
  notifyLowStock: true,
  notifyNewOrders: true,
  notifyFlashSale: true,
  autoPublishReviews: false,
  defaultCurrency: "EUR",
  fulfillmentSlaHours: 48,
};

export const brandProfile = {
  name: "Amara Okafor",
  email: "brand.manager@veronicamark.com",
  title: "Brand Manager",
  phone: "+33 1 42 00 00 00",
  brandName: brandWorkspace.brandName,
  timezone: "Europe/Paris",
  language: "English",
};
