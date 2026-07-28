import { config } from "dotenv";
config({ path: ".env.local" });

import { productRepository } from "../lib/repositories/product.repository";

async function main() {
  const result = await productRepository.listPublished({ page: 1, pageSize: 200 });
  console.log(
    JSON.stringify(
      {
        total: result.total,
        items: result.items.map((p) => ({
          slug: p.slug,
          brandSlug: p.brand?.slug,
          categorySlug: p.category?.slug,
          variantCount: p.variants?.length,
          price: p.variants?.[0]?.salePrice ?? p.variants?.[0]?.price,
          mediaCount: p.media?.length,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
