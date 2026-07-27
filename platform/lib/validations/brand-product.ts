import { z } from "zod";

import { moneySchema, slugSchema } from "@/lib/validations/database";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null));

const mediaUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Image URL must be a site path or absolute http(s) URL",
  );

export const brandProductVariantInputSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().trim().min(3).max(64),
  sizeLabel: optionalTrimmed(32),
  price: moneySchema,
  salePrice: moneySchema.optional().nullable(),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  available: z.coerce.number().int().nonnegative().default(0),
  reorderLevel: z.coerce.number().int().nonnegative().default(5),
});

export const brandProductMediaInputSchema = z.object({
  id: z.string().uuid().optional(),
  url: mediaUrlSchema,
  altText: optionalTrimmed(200),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
});

export const brandProductSeoInputSchema = z.object({
  metaTitle: optionalTrimmed(120),
  metaDescription: optionalTrimmed(320),
  canonicalUrl: optionalTrimmed(500),
  keywords: z.array(z.string().trim().min(1).max(64)).max(20).default([]),
});

export const updateBrandProductSchema = z
  .object({
    productId: z.string().uuid(),
    name: z.string().trim().min(2).max(160),
    slug: slugSchema,
    barcode: optionalTrimmed(64),
    shortDescription: optionalTrimmed(280),
    description: optionalTrimmed(10000),
    categoryId: z.string().uuid(),
    featured: z.boolean().default(false),
    newArrival: z.boolean().default(false),
    bestSeller: z.boolean().default(false),
    variants: z.array(brandProductVariantInputSchema).min(1).max(30),
    media: z.array(brandProductMediaInputSchema).max(20),
    seo: brandProductSeoInputSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const skus = data.variants.map((variant) => variant.sku.toLowerCase());
    const duplicateSku = skus.find((sku, index) => skus.indexOf(sku) !== index);
    if (duplicateSku) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate SKU in variants: ${duplicateSku}`,
        path: ["variants"],
      });
    }

    for (const [index, variant] of data.variants.entries()) {
      if (variant.salePrice != null && variant.salePrice > variant.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sale price cannot exceed list price",
          path: ["variants", index, "salePrice"],
        });
      }
    }

    const primaryCount = data.media.filter((item) => item.isPrimary).length;
    if (data.media.length > 0 && primaryCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mark one image as primary",
        path: ["media"],
      });
    }
    if (primaryCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one image can be primary",
        path: ["media"],
      });
    }
  });

export type UpdateBrandProductInput = z.infer<typeof updateBrandProductSchema>;
export type BrandProductVariantInput = z.infer<typeof brandProductVariantInputSchema>;
export type BrandProductMediaInput = z.infer<typeof brandProductMediaInputSchema>;
