/**
 * Import Perfume Invoice products into the store database.
 *
 * - costPrice = invoice Rate (NGN)
 * - price (selling) = costPrice × 1.5
 * - stock = invoice Qty
 * - currency defaults remain NGN
 *
 * Usage: pnpm db:import-invoice
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import {
  BrandStatus,
  InventoryStatus,
  MediaType,
  PrismaClient,
  ProductStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import {
  INVOICE_PRODUCTS,
  sellPriceFromCost,
  slugifyProductName,
} from "./invoice-products";

const prisma = new PrismaClient();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

function sizeLabelFromName(name: string): string | undefined {
  const match = name.match(/(\d+\s*ml)/i);
  return match?.[1]?.replace(/\s+/g, "").toLowerCase();
}

function inventoryStatus(available: number, reorderLevel: number): InventoryStatus {
  if (available <= 0) return InventoryStatus.OUT_OF_STOCK;
  if (available <= reorderLevel) return InventoryStatus.LOW_STOCK;
  return InventoryStatus.IN_STOCK;
}

async function main() {
  console.log(`Importing ${INVOICE_PRODUCTS.length} invoice products…`);

  const brand = await prisma.brand.upsert({
    where: { slug: "veronica-mark-atelier" },
    update: {
      status: BrandStatus.ACTIVE,
      featured: true,
      country: "NG",
    },
    create: {
      name: "VERONICA MARK Atelier",
      slug: "veronica-mark-atelier",
      description:
        "House brand for curated luxury fragrances — managed exclusively by VERONICA MARK.",
      country: "NG",
      featured: true,
      status: BrandStatus.ACTIVE,
      contactEmail: "atelier@veronicamark.com",
      contactPhone: "+2348000000000",
    },
  });

  const perfumes = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: { featured: true },
    create: {
      name: "Perfumes",
      slug: "perfumes",
      sortOrder: 0,
      featured: true,
    },
  });

  const bodyCare = await prisma.category.upsert({
    where: { slug: "body-mists" },
    update: { featured: true },
    create: {
      name: "Body Mists & Sprays",
      slug: "body-mists",
      sortOrder: 1,
      featured: true,
      description: "Body mists, sprays, and deodorants from the VERONICA MARK edit.",
    },
  });

  // Hide demo seed fragrances so the invoice catalog is the live assortment.
  await prisma.product.updateMany({
    where: { slug: { in: ["noir-eclat-edp", "sable-meridian-cologne"] } },
    data: { visible: false, status: ProductStatus.ARCHIVED },
  });

  await prisma.systemSetting.upsert({
    where: { key: "default_currency" },
    update: { value: "NGN" },
    create: {
      key: "default_currency",
      value: "NGN",
      description: "Default storefront currency",
      isPublic: true,
    },
  });

  let imported = 0;
  let updated = 0;

  for (let index = 0; index < INVOICE_PRODUCTS.length; index += 1) {
    const item = INVOICE_PRODUCTS[index]!;
    const slug = slugifyProductName(item.name);
    const sku = `VM-INV-${String(index + 1).padStart(3, "0")}`;
    const cost = item.costPrice;
    const sell = sellPriceFromCost(cost);
    const categoryId = item.category === "body" ? bodyCare.id : perfumes.id;
    const sizeLabel = sizeLabelFromName(item.name);
    const reorderLevel = item.category === "body" ? 3 : 1;

    const existing = await prisma.product.findUnique({ where: { slug } });

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: item.name,
        brandId: brand.id,
        categoryId,
        shortDescription: `${item.name} — curated by VERONICA MARK.`,
        description: `${item.name} from the VERONICA MARK fragrance edit. Authenticity assured.`,
        status: ProductStatus.PUBLISHED,
        visible: true,
        publishedAt: existing?.publishedAt ?? new Date(),
        newArrival: true,
      },
      create: {
        brandId: brand.id,
        categoryId,
        name: item.name,
        slug,
        barcode: `VM-INV-${String(index + 1).padStart(4, "0")}`,
        shortDescription: `${item.name} — curated by VERONICA MARK.`,
        description: `${item.name} from the VERONICA MARK fragrance edit. Authenticity assured.`,
        status: ProductStatus.PUBLISHED,
        visible: true,
        publishedAt: new Date(),
        newArrival: true,
        featured: index < 8,
      },
    });

    await prisma.productSEO.upsert({
      where: { productId: product.id },
      update: {
        metaTitle: `${item.name} | VERONICA MARK`,
        metaDescription: `Shop ${item.name} in Naira from VERONICA MARK.`,
        canonicalUrl: `/products/${slug}`,
      },
      create: {
        productId: product.id,
        metaTitle: `${item.name} | VERONICA MARK`,
        metaDescription: `Shop ${item.name} in Naira from VERONICA MARK.`,
        canonicalUrl: `/products/${slug}`,
      },
    });

    const mediaCount = await prisma.productMedia.count({
      where: { productId: product.id, deletedAt: null },
    });
    if (mediaCount === 0) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: FALLBACK_IMAGE,
          altText: item.name,
          type: MediaType.IMAGE,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    } else {
      await prisma.productMedia.updateMany({
        where: { productId: product.id, deletedAt: null },
        data: { url: FALLBACK_IMAGE, altText: item.name },
      });
    }

    const variant = await prisma.productVariant.upsert({
      where: { sku },
      update: {
        productId: product.id,
        costPrice: new Decimal(cost.toFixed(2)),
        price: new Decimal(sell.toFixed(2)),
        salePrice: null,
        sizeLabel,
        active: true,
      },
      create: {
        productId: product.id,
        sku,
        costPrice: new Decimal(cost.toFixed(2)),
        price: new Decimal(sell.toFixed(2)),
        sizeLabel,
        active: true,
        sortOrder: 0,
      },
    });

    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: {
        available: item.qty,
        reserved: 0,
        reorderLevel,
        status: inventoryStatus(item.qty, reorderLevel),
      },
      create: {
        variantId: variant.id,
        available: item.qty,
        reserved: 0,
        reorderLevel,
        status: inventoryStatus(item.qty, reorderLevel),
      },
    });

    if (existing) updated += 1;
    else imported += 1;
  }

  console.log(`Done. Created ${imported}, updated ${updated}.`);
  console.log("Selling price = cost × 1.5 (NGN). Stock set from invoice Qty.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
