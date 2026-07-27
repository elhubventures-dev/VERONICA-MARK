# Product images

Each invoice product has a folder named after its **slug**.

## Replace a stand-in with your real photo

1. Find the product slug (e.g. `maahir-perfume`).
2. Overwrite:
   ```
   public/media/products/<slug>/front.jpg
   ```
3. Re-run `pnpm db:assign-product-images` (keeps your file, refreshes DB URLs).

## Notes

- Current images are **royalty-free Unsplash stand-ins**, not official brand bottles.
- Competitor / retailer product photos cannot be copied into the storefront (copyright).
- Prefer your own photography of the bottles you stock.
