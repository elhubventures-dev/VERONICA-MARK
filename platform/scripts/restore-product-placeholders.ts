/**
 * Restore every product's primary media to the shared Unsplash placeholder.
 * Usage: pnpm exec tsx scripts/restore-product-placeholders.ts
 */
import { MediaType, PrismaClient } from "@prisma/client";

import { INVOICE_PRODUCTS, slugifyProductName } from "./invoice-products";

const prisma = new PrismaClient();

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

async function main() {
  let updated = 0;

  for (const item of INVOICE_PRODUCTS) {
    const slug = slugifyProductName(item.name);
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { media: { where: { deletedAt: null } } },
    });
    if (!product) continue;

    const primary = product.media.find((m) => m.isPrimary) ?? product.media[0];
    if (primary) {
      await prisma.productMedia.update({
        where: { id: primary.id },
        data: {
          url: PLACEHOLDER,
          altText: item.name,
          type: MediaType.IMAGE,
          isPrimary: true,
        },
      });
    } else {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: PLACEHOLDER,
          altText: item.name,
          type: MediaType.IMAGE,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }
    updated += 1;
  }

  // Also restore any other published products still on local /media paths
  const localMedia = await prisma.productMedia.updateMany({
    where: {
      deletedAt: null,
      url: { startsWith: "/media/products/" },
    },
    data: { url: PLACEHOLDER },
  });

  console.log(`Restored placeholder on ${updated} invoice products.`);
  console.log(`Also reset ${localMedia.count} remaining local media URLs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
