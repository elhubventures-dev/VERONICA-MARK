import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductEditorForm } from "@/components/brand/product-editor-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getSessionBrandId } from "@/lib/data/session-context";
import {
  getBrandCategoryOptions,
  getBrandProductEditor,
} from "@/lib/brand/queries";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type BrandProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BrandProductEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getBrandProductEditor(id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `Edit ${product.name} · Brand Product`,
    description: `Edit catalog fields, variants, imagery, and SEO for ${product.name}.`,
  };
}

export default async function BrandProductEditPage({ params }: BrandProductEditPageProps) {
  const { id } = await params;
  const [product, categories, brandId] = await Promise.all([
    getBrandProductEditor(id),
    getBrandCategoryOptions(),
    getSessionBrandId(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={`Edit ${product.name}`}
        description="Update name, pricing, descriptions, variants, images, and SEO. Amounts are NGN."
        actions={
          <Button asChild variant="outline">
            <Link href={`/brand/products/${product.id}`}>
              <ArrowLeft aria-hidden />
              Back to product
            </Link>
          </Button>
        }
      />

      <ProductEditorForm
        product={product}
        categories={categories}
        canPersist={Boolean(brandId) && UUID_RE.test(product.id)}
      />
    </div>
  );
}
