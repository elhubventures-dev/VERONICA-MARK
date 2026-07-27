"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  createBrandProductImageUploadAction,
  updateBrandProductAction,
} from "@/lib/brand/actions";
import type {
  BrandCategoryOption,
  BrandProductEditor,
  BrandProductEditorMedia,
  BrandProductEditorVariant,
} from "@/lib/brand/demo-data";

type ProductEditorFormProps = {
  product: BrandProductEditor;
  categories: BrandCategoryOption[];
  /** When false, save persists to demo toast only (no brand session). */
  canPersist?: boolean;
};

type DraftVariant = BrandProductEditorVariant & { key: string };
type DraftMedia = BrandProductEditorMedia & { key: string };

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function createKey() {
  return `tmp-${Math.random().toString(36).slice(2, 10)}`;
}

export function ProductEditorForm({
  product,
  categories,
  canPersist = true,
}: ProductEditorFormProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [name, setName] = React.useState(product.name);
  const [slug, setSlug] = React.useState(product.slug);
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [barcode, setBarcode] = React.useState(product.barcode ?? "");
  const [shortDescription, setShortDescription] = React.useState(product.shortDescription ?? "");
  const [description, setDescription] = React.useState(product.description ?? "");
  const [categoryId, setCategoryId] = React.useState(product.categoryId);
  const [featured, setFeatured] = React.useState(product.featured);
  const [newArrival, setNewArrival] = React.useState(product.newArrival);
  const [bestSeller, setBestSeller] = React.useState(product.bestSeller);
  const [variants, setVariants] = React.useState<DraftVariant[]>(
    product.variants.map((variant) => ({ ...variant, key: variant.id })),
  );
  const [media, setMedia] = React.useState<DraftMedia[]>(
    product.media.map((item) => ({ ...item, key: item.id })),
  );
  const [metaTitle, setMetaTitle] = React.useState(product.seo.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = React.useState(product.seo.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = React.useState(product.seo.canonicalUrl ?? "");
  const [keywords, setKeywords] = React.useState(product.seo.keywords.join(", "));
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function updateVariant(key: string, patch: Partial<DraftVariant>) {
    setVariants((current) =>
      current.map((variant) => (variant.key === key ? { ...variant, ...patch } : variant)),
    );
  }

  function updateMedia(key: string, patch: Partial<DraftMedia>) {
    setMedia((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function addVariant() {
    const index = variants.length + 1;
    setVariants((current) => [
      ...current,
      {
        key: createKey(),
        id: "",
        sku: `${product.slug || "sku"}-${index}`.slice(0, 64),
        sizeLabel: "",
        price: current[0]?.price ?? 0,
        salePrice: null,
        active: true,
        sortOrder: current.length,
        available: 0,
        reserved: 0,
        reorderLevel: 5,
      },
    ]);
  }

  function removeVariant(key: string) {
    setVariants((current) => {
      if (current.length <= 1) {
        toast.error("At least one variant is required");
        return current;
      }
      return current.filter((variant) => variant.key !== key);
    });
  }

  function addMediaFromUrl() {
    setMedia((current) => {
      const next: DraftMedia = {
        key: createKey(),
        id: "",
        url: "",
        altText: name || product.name,
        sortOrder: current.length,
        isPrimary: current.length === 0,
      };
      return [...current, next];
    });
  }

  function removeMedia(key: string) {
    setMedia((current) => {
      const next = current.filter((item) => item.key !== key);
      if (next.length > 0 && !next.some((item) => item.isPrimary)) {
        return next.map((item, index) =>
          index === 0 ? { ...item, isPrimary: true } : { ...item, isPrimary: false },
        );
      }
      return next;
    });
  }

  function setPrimaryMedia(key: string) {
    setMedia((current) => current.map((item) => ({ ...item, isPrimary: item.key === key })));
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    if (!canPersist) {
      toast.message("Demo mode", {
        description: "Sign in as a Brand Manager to upload product images.",
      });
      return;
    }

    setUploading(true);
    const result = await createBrandProductImageUploadAction({
      productId: product.id,
      fileName: file.name,
      contentType: file.type || "image/jpeg",
    });

    if (!result.ok || !result.data?.signedUrl || !result.data?.publicUrl) {
      toast.error(result.message || "Could not prepare image upload");
      setUploading(false);
      return;
    }

    try {
      const uploadResponse = await fetch(String(result.data.signedUrl), {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "image/jpeg",
          ...(result.data.token ? { Authorization: `Bearer ${String(result.data.token)}` } : {}),
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed (${uploadResponse.status})`);
      }

      const publicUrl = String(result.data.publicUrl);
      setMedia((current) => [
        ...current,
        {
          key: createKey(),
          id: "",
          url: publicUrl,
          altText: name || product.name,
          sortOrder: current.length,
          isPrimary: current.length === 0,
        },
      ]);
      toast.success("Image uploaded", { description: "Remember to save the product." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canPersist) {
      toast.message("Demo mode", {
        description: "Sign in as a Brand Manager to save catalog changes.",
      });
      return;
    }

    if (!categoryId || categoryId.startsWith("demo-")) {
      toast.error("Select a real catalog category before saving");
      return;
    }

    if (variants.some((variant) => !variant.sku.trim())) {
      toast.error("Every variant needs a SKU");
      return;
    }

    if (media.some((item) => !item.url.trim())) {
      toast.error("Every image needs a URL or upload");
      return;
    }

    setPending(true);

    const payload = {
      productId: product.id,
      name: name.trim(),
      slug: slug.trim(),
      barcode: barcode.trim() || null,
      shortDescription: shortDescription.trim() || null,
      description: description.trim() || null,
      categoryId,
      featured,
      newArrival,
      bestSeller,
      variants: variants.map((variant, index) => ({
        ...(variant.id ? { id: variant.id } : {}),
        sku: variant.sku.trim(),
        sizeLabel: variant.sizeLabel?.trim() || null,
        price: Number(variant.price),
        salePrice:
          variant.salePrice == null || Number.isNaN(Number(variant.salePrice))
            ? null
            : Number(variant.salePrice),
        active: variant.active,
        sortOrder: index,
        available: Number(variant.available),
        reorderLevel: Number(variant.reorderLevel),
      })),
      media: media.map((item, index) => ({
        ...(item.id ? { id: item.id } : {}),
        url: item.url.trim(),
        altText: item.altText?.trim() || null,
        sortOrder: index,
        isPrimary: item.isPrimary,
      })),
      seo: {
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
        canonicalUrl: canonicalUrl.trim() || null,
        keywords: keywords
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      },
    };

    const result = await updateBrandProductAction(payload);
    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message, { description: name });
    router.push(`/brand/products/${product.id}`);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
          <CardDescription>Identity, category, and storefront copy for this fragrance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-name">Name</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(event) => {
                const next = event.target.value;
                setName(next);
                if (!slugTouched) setSlug(toSlug(next));
              }}
              required
              maxLength={160}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-slug">Slug</Label>
            <Input
              id="product-slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(toSlug(event.target.value));
              }}
              required
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-barcode">Barcode</Label>
            <Input
              id="product-barcode"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              maxLength={64}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="product-category" aria-label="Category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-short">Short description</Label>
            <Textarea
              id="product-short"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              rows={2}
              maxLength={280}
              placeholder="One-line storefront summary"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              maxLength={10000}
              placeholder="Full product story, notes, and wearing guidance"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchandising</CardTitle>
          <CardDescription>Flags that influence discovery placements. Status stays on the product page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: "Featured",
              description: "Eligible for featured storefront surfaces.",
              checked: featured,
              onCheckedChange: setFeatured,
            },
            {
              title: "New arrival",
              description: "Highlight in new arrivals collections.",
              checked: newArrival,
              onCheckedChange: setNewArrival,
            },
            {
              title: "Best seller",
              description: "Mark as a best-seller merchandising candidate.",
              checked: bestSeller,
              onCheckedChange: setBestSeller,
            },
          ].map((row) => (
            <div
              key={row.title}
              className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium">{row.title}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{row.description}</p>
              </div>
              <Switch
                checked={row.checked}
                onCheckedChange={row.onCheckedChange}
                aria-label={`Toggle ${row.title}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Variants</CardTitle>
            <CardDescription>
              Prices are in Nigerian Naira (₦). Stock changes write an inventory movement.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus aria-hidden />
            Add variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant) => (
            <div
              key={variant.key}
              className="space-y-4 rounded-xl border border-[var(--color-border)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
                  {variant.sizeLabel || variant.sku || "Variant"}
                  {variant.reserved > 0 ? ` · ${variant.reserved} reserved` : null}
                </p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={variant.active}
                      onCheckedChange={(checked) => updateVariant(variant.key, { active: checked })}
                      aria-label={`Toggle active for ${variant.sku || "variant"}`}
                    />
                    Active
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(variant.key)}
                    aria-label="Remove variant"
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={variant.sku}
                    onChange={(event) => updateVariant(variant.key, { sku: event.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Size label</Label>
                  <Input
                    value={variant.sizeLabel ?? ""}
                    onChange={(event) =>
                      updateVariant(variant.key, { sizeLabel: event.target.value || null })
                    }
                    placeholder="100 ml"
                  />
                </div>
                <div className="space-y-2">
                  <Label>List price (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(variant.key, { price: Number(event.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale price (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={variant.salePrice ?? ""}
                    onChange={(event) =>
                      updateVariant(variant.key, {
                        salePrice: event.target.value === "" ? null : Number(event.target.value),
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available stock</Label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={variant.available}
                    onChange={(event) =>
                      updateVariant(variant.key, {
                        available: Math.max(0, Math.floor(Number(event.target.value) || 0)),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reorder level</Label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={variant.reorderLevel}
                    onChange={(event) =>
                      updateVariant(variant.key, {
                        reorderLevel: Math.max(0, Math.floor(Number(event.target.value) || 0)),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Images</CardTitle>
            <CardDescription>
              Upload to Supabase when configured, or paste a site path / absolute image URL.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => void handleImageUpload(event.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus aria-hidden />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={addMediaFromUrl}>
              <Plus aria-hidden />
              Add URL
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {media.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              No images yet. Upload a file or add a URL to continue.
            </p>
          ) : null}
          {media.map((item) => (
            <div
              key={item.key}
              className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 lg:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--color-muted)]">
                {item.url ? (
                  <Image
                    src={item.url}
                    alt={item.altText || name || "Product image"}
                    fill
                    className="object-contain"
                    sizes="120px"
                    unoptimized={item.url.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted-foreground)]">
                    Preview
                  </div>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    value={item.url}
                    onChange={(event) => updateMedia(item.key, { url: event.target.value })}
                    placeholder="/media/products/… or https://…"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Alt text</Label>
                  <Input
                    value={item.altText ?? ""}
                    onChange={(event) =>
                      updateMedia(item.key, { altText: event.target.value || null })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col items-stretch justify-between gap-2">
                <Button
                  type="button"
                  variant={item.isPrimary ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrimaryMedia(item.key)}
                >
                  <Star aria-hidden />
                  {item.isPrimary ? "Primary" : "Make primary"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedia(item.key)}
                  aria-label="Remove image"
                >
                  <Trash2 aria-hidden />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search metadata for this product page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="meta-title">Meta title</Label>
            <Input
              id="meta-title"
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="meta-description">Meta description</Label>
            <Textarea
              id="meta-description"
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
              rows={3}
              maxLength={320}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canonical-url">Canonical URL</Label>
            <Input
              id="canonical-url"
              value={canonicalUrl}
              onChange={(event) => setCanonicalUrl(event.target.value)}
              placeholder={`/products/${slug || "slug"}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Comma-separated"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        <Button asChild type="button" variant="ghost">
          <Link href={`/brand/products/${product.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving…" : "Save product"}
        </Button>
      </div>
    </form>
  );
}
