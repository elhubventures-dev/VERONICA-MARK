import type { Metadata } from "next";
import Image from "next/image";
import { FileText, FolderOpen, ImageIcon, Upload, Video } from "lucide-react";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { DemoToastButton } from "@/components/brand/demo-toast-button";
import { PageHeader } from "@/components/layout/page-header";
import { PhotographyBriefPanel } from "@/components/marketing/photography-brief-panel";
import { Badge } from "@/components/ui/badge";
import { getBrandMedia } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Media Library",
  description: "Browse campaign assets, imagery, and documents used across VERONICA MARK brand surfaces.",
};

function formatUploadDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BrandMediaPage() {
  const assets = await getBrandMedia();

  const imageCount = assets.filter((asset) => asset.type === "image").length;
  const videoCount = assets.filter((asset) => asset.type === "video").length;
  const documentCount = assets.filter((asset) => asset.type === "document").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Media library"
        description="Keep campaign assets, PDP imagery, and working files organised. Follow the photography brief before every upload."
        actions={
          <DemoToastButton
            label="Upload asset"
            message="Asset upload is in demo mode"
            description="Confirm the photography brief checklist before connecting storage."
            icon={<Upload aria-hidden />}
          />
        }
      />

      <PhotographyBriefPanel compact />

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          All assets · {assets.length}
        </Badge>
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          Images · {imageCount}
        </Badge>
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          Videos · {videoCount}
        </Badge>
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          Documents · {documentCount}
        </Badge>
      </div>

      {assets.length === 0 ? (
        <BrandEmptyState
          title="No media assets yet"
          description="Upload imagery, campaign files, or brand documents to keep creative production moving."
          actionLabel="Open products"
          actionHref="/brand/products"
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              {asset.type === "image" ? (
                <div className="relative w-full bg-[var(--color-muted)]" style={{ aspectRatio: "1 / 1" }}>
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
              ) : (
                <div
                  className="flex w-full items-center justify-center bg-[var(--color-muted)]"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <div className="text-center">
                    {asset.type === "video" ? (
                      <Video className="mx-auto size-10 text-[var(--color-muted-foreground)]" aria-hidden />
                    ) : (
                      <FileText className="mx-auto size-10 text-[var(--color-muted-foreground)]" aria-hidden />
                    )}
                    <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                      {asset.type === "video" ? "Video preview placeholder" : "Document preview placeholder"}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-xl">{asset.name}</h2>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{asset.usedOn}</p>
                  </div>
                  <Badge variant="outline" className="rounded-lg capitalize">
                    {asset.type}
                  </Badge>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">File size</p>
                    <p className="mt-1 font-medium">{asset.sizeKb.toLocaleString("en-GB")} KB</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">Uploaded</p>
                    <p className="mt-1 font-medium">{formatUploadDate(asset.uploadedAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-sm">
                  <div className="text-[var(--color-muted-foreground)]">
                    By <span className="text-[var(--color-foreground)]">{asset.uploadedBy}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)]">
                    {asset.type === "image" ? (
                      <ImageIcon className="size-4" aria-hidden />
                    ) : (
                      <FolderOpen className="size-4" aria-hidden />
                    )}
                    Asset ready
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
