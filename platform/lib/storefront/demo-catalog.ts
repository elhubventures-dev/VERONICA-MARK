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
    phone?: string;
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

export const demoBrands: StorefrontBrand[] = [
  {
    id: "vma-scents",
    slug: "vma-scents",
    name: "VMA SCENTS",
    description:
      "House brand for curated luxury fragrances — managed exclusively by VERONICA MARK.",
    image: "/media/brands/vma-scents.png",
  },
  {
    id: "maison-violette",
    slug: "maison-violette",
    name: "Maison Violette",
    description: "Parisian florals with a modern, velvet finish.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "atelier-noir",
    slug: "atelier-noir",
    name: "Atelier Noir",
    description: "Smoky woods, rare resins and after-dark elegance.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "or-jardin",
    slug: "or-jardin",
    name: "Or Jardin",
    description: "Sunlit citrus and green notes inspired by the Riviera.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
  },
];

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

// Placeholder maisons (Maison Violette, Atelier Noir) intentionally have no demo
// products — they mirror the seeded DB brands that are live with an empty catalog.
export const demoProducts: StorefrontProduct[] = [
  {
    id: "velvet-iris",
    slug: "velvet-iris",
    name: "Velvet Iris",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Women",
    categorySlug: "women",
    price: 247500,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    badge: "new",
    flashSale: true,
  },
  {
    id: "nocturne-oud",
    slug: "nocturne-oud",
    name: "Nocturne Oud",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Men",
    categorySlug: "men",
    price: 315000,
    compareAt: 367500,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    badge: "limited",
    flashSale: true,
  },
  {
    id: "soleil-neroli",
    slug: "soleil-neroli",
    name: "Soleil Néroli",
    brand: "Or Jardin",
    brandSlug: "or-jardin",
    category: "Women",
    categorySlug: "women",
    price: 222000,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    badge: "bestseller",
    flashSale: true,
  },
  {
    id: "purple-reign",
    slug: "purple-reign",
    name: "Purple Reign",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Perfumes",
    categorySlug: "perfumes",
    price: 292500,
    image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&w=900&q=85",
    badge: "exclusive",
    flashSale: true,
  },
  {
    id: "santal-minuit",
    slug: "santal-minuit",
    name: "Santal Minuit",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Men",
    categorySlug: "men",
    price: 270000,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85",
    badge: "new",
  },
  {
    id: "figue-dor",
    slug: "figue-dor",
    name: "Figue d'Or",
    brand: "Or Jardin",
    brandSlug: "or-jardin",
    category: "Perfumes",
    categorySlug: "perfumes",
    price: 232500,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "ambre-soie",
    slug: "ambre-soie",
    name: "Ambre Soie",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Women",
    categorySlug: "women",
    price: 262500,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=85",
    badge: "bestseller",
  },
  {
    id: "vetiver-prive",
    slug: "vetiver-prive",
    name: "Vétiver Privé",
    brand: "VMA SCENTS",
    brandSlug: "vma-scents",
    category: "Men",
    categorySlug: "men",
    price: 282000,
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=900&q=85",
  },
];

const productDescriptions: Record<string, string> = {
  "velvet-iris":
    "A luminous iris wrapped in violet suede and soft musk. Velvet Iris opens with bergamot and pink pepper before settling into a powdery heart of orris and heliotrope.",
  "nocturne-oud":
    "Dark oud and smoked cedar meet saffron and rose in a composition built for evening. Nocturne Oud lingers with amber resin and a trace of leather.",
  "soleil-neroli":
    "Mediterranean neroli and bitter orange blossom over sun-warmed fig leaf. Soleil Néroli is radiant, clean, and effortlessly elegant.",
  "purple-reign":
    "Royal plum, blackcurrant, and iris absolute crowned with vanilla orchid. Purple Reign is opulent yet refined — a statement without excess.",
  "santal-minuit":
    "Creamy sandalwood, cardamom, and midnight violet. Santal Minuit is warm, intimate, and unmistakably masculine.",
  "figue-dor":
    "Green fig, white tea, and golden hay under a soft amber veil. Figue d'Or captures late-summer light in a bottle.",
  "ambre-soie":
    "Silken amber, tonka, and jasmine sambac woven with a whisper of patchouli. Ambre Soie drapes the skin in golden warmth.",
  "vetiver-prive":
    "Haitian vetiver, grapefruit zest, and Haitian pepper with a dry cedar base. Vétiver Privé is crisp, earthy, and impeccably tailored.",
};

function buildVariants(product: StorefrontProduct): StorefrontVariant[] {
  const base50 = Math.round(product.price * 0.72);
  const base100 = product.price;
  const stock = product.stock ?? 6;
  return [
    {
      id: `${product.id}-50ml`,
      label: "50 ml",
      price: base50,
      compareAt: product.compareAt ? Math.round(product.compareAt * 0.72) : undefined,
      available: stock > 0,
      stock: Math.max(0, Math.ceil(stock / 2)),
    },
    {
      id: `${product.id}-100ml`,
      label: "100 ml",
      price: base100,
      compareAt: product.compareAt,
      available: stock > 0,
      stock,
    },
  ];
}

function buildReviews(product: StorefrontProduct): StorefrontReview[] {
  return [
    {
      id: `${product.id}-r1`,
      author: "Camille R.",
      rating: 5,
      title: "Exactly as described",
      body: `${product.name} wears beautifully — refined projection and exceptional longevity. Arrived impeccably packaged.`,
      date: "2026-06-12",
    },
    {
      id: `${product.id}-r2`,
      author: "James L.",
      rating: 4,
      title: "A new favourite",
      body: `Elegant and distinctive. The ${product.brand} character really shines through.`,
      date: "2026-05-28",
    },
  ];
}

function buildSpecs(product: StorefrontProduct): { label: string; value: string }[] {
  const families = ["Floral amber", "Woody aromatic", "Citrus green", "Oriental floral", "Fresh woody"];
  const family = families[product.name.length % families.length] ?? "Floral amber";
  return [
    { label: "Concentration", value: "Eau de Parfum" },
    { label: "Olfactive family", value: family },
    { label: "House", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Origin", value: "Curated via VERONICA MARK" },
    { label: "Authenticity", value: "Managed-brand verified" },
  ];
}

export const demoProductDetails: StorefrontProductDetail[] = demoProducts.map((product, index) => {
  const related = demoProducts
    .filter((p) => p.slug !== product.slug && (p.brandSlug === product.brandSlug || p.categorySlug === product.categorySlug))
    .slice(0, 4)
    .map((p) => p.slug);

  const altImage =
    index % 2 === 0
      ? "https://images.unsplash.com/photo-1595425979535-950d65c4fd73?auto=format&fit=crop&w=900&q=85"
      : "https://images.unsplash.com/photo-1585386959984-a41552231654?auto=format&fit=crop&w=900&q=85";

  return {
    ...product,
    description: productDescriptions[product.slug] ?? `An exceptional fragrance from ${product.brand}.`,
    images: [
      { src: product.image, alt: `${product.brand} ${product.name}` },
      { src: altImage, alt: `${product.name} detail` },
    ],
    variants: buildVariants(product),
    specs: buildSpecs(product),
    reviews: buildReviews(product),
    relatedSlugs: related.length ? related : demoProducts.filter((p) => p.slug !== product.slug).slice(0, 3).map((p) => p.slug),
  };
});

export function getDemoProductBySlug(slug: string): StorefrontProductDetail | undefined {
  return demoProductDetails.find((p) => p.slug === slug);
}

export function getDemoProductsByBrand(brandSlug: string): StorefrontProduct[] {
  return demoProducts.filter((p) => p.brandSlug === brandSlug);
}

export function getDemoProductsByCategory(categorySlug: string): StorefrontProduct[] {
  return demoProducts.filter(
    (p) => p.categorySlug === categorySlug || p.categorySlug === categorySlug,
  );
}

export function getFlashSaleProducts(): StorefrontProduct[] {
  return demoProducts.filter((p) => p.flashSale);
}

/** Canonical August opening offer — single source for UI, seed, and checkout demos. */
export const OPENING_COUPON_CODE = "VM5AUG-20";
export const OPENING_DISCOUNT_PERCENT = 20;

export const flashSale = {
  title: "Private Opening Edit",
  description:
    "A carefully selected opening collection with exclusive pricing on signature compositions — presented with the same curation as the full edit.",
  /** Canonical August Grand Opening offer. */
  discountPercent: OPENING_DISCOUNT_PERCENT,
  /** Primary checkout coupon for the opening edit. */
  couponCode: OPENING_COUPON_CODE,
  /** Europe/Paris (+01:00 in August) — 1 Aug 00:00 through 7 Aug 23:59 */
  startsAt: "2026-08-01T00:00:00+01:00",
  endsAt: "2026-08-07T23:59:59+01:00",
};

export const demoCoupons: Record<string, { type: "PERCENTAGE" | "FIXED_AMOUNT"; value: number }> = {
  [OPENING_COUPON_CODE]: { type: "PERCENTAGE", value: OPENING_DISCOUNT_PERCENT },
  // Legacy aliases still accepted at checkout
  AUGUST20: { type: "PERCENTAGE", value: OPENING_DISCOUNT_PERCENT },
  GRANDOPEN: { type: "PERCENTAGE", value: OPENING_DISCOUNT_PERCENT },
  WELCOME15: { type: "PERCENTAGE", value: 15 },
};

export const demoOrders: Record<string, DemoOrder> = {
  "VM-2026-0001": {
    orderNumber: "VM-2026-0001",
    createdAt: "2026-07-20T14:32:00+01:00",
    email: "guest@example.com",
    status: "CONFIRMED",
    shippingAddress: {
      name: "Veronica Guest",
      line1: "12 Rue de la Paix",
      city: "Paris",
      postalCode: "75002",
      country: "France",
    },
    items: [
      {
        title: "Velvet Iris",
        brand: "Maison Violette",
        variant: "100 ml",
        quantity: 1,
        unitPrice: 247500,
      },
      {
        title: "Nocturne Oud",
        brand: "Atelier Noir",
        variant: "50 ml",
        quantity: 1,
        unitPrice: 226500,
      },
    ],
    subtotal: 474000,
    tax: 94800,
    shipping: 18000,
    discount: 47400,
    total: 539400,
    currency: "NGN",
  },
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
