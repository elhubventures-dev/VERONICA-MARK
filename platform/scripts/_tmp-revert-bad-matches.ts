import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { PrismaClient } from "@prisma/client";

const BAD_SLUGS = [
  "giorgio-perfume-mix",
  "intense-noir-perfume-100ml",
  "salt-perfume-100ml",
  "silk-mood-perfume-100ml",
  "victoria-world-mist-250ml",
  "velvet-oud-perfume",
  "oud-noir-perfume-100ml",
  "berries-weekend-perfume-100ml",
  "breed-my-man-perfume-100ml",
  "arabiyat-prestige-nyla-perfume-100ml",
  "brosia-body-spray",
  "cuba-mist-100ml",
  "ajayeb-dubai-perfume-100ml",
  "my-her-perfume-100ml",
  "noir-eclat-edp",
  "lattafa-body-spray-200ml",
  "just-jack-1691-perfume-100ml-mix",
];

const prisma = new PrismaClient();

async function main() {
  for (const slug of BAD_SLUGS) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { media: { where: { deletedAt: null } } },
    });
    if (!product) {
      console.log("missing", slug);
      continue;
    }
    const supabaseMedia = product.media.filter((m) => m.url.includes("supabase.co"));
    if (!supabaseMedia.length) {
      console.log("no supabase media", slug);
      continue;
    }
    await prisma.productMedia.updateMany({
      where: {
        productId: product.id,
        deletedAt: null,
        url: { contains: "supabase.co" },
      },
      data: { deletedAt: new Date(), isPrimary: false },
    });
    await prisma.productMedia.create({
      data: {
        productId: product.id,
        url: `/media/products/${slug}/front.jpg`,
        altText: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });
    console.log("reverted", slug);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
