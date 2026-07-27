import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminCmsPages } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin CMS",
  description: "Manage marketplace editorial pages, publication state, and demo edit flows.",
};

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCmsStatusVariant(status: "draft" | "published" | "archived") {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
    default:
      return "outline";
  }
}

export default async function AdminCmsPage() {
  const pages = await getAdminCmsPages();
  const sortedPages = [...pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="CMS"
        description="Oversee editorial pages across the marketplace, confirm publication state, and trigger demo editing actions for content operations."
      />

      {sortedPages.length ? (
        <section aria-label="CMS pages" className="space-y-4">
          {sortedPages.map((page) => (
            <article
              key={page.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{page.title}</h2>
                    <Badge variant={getCmsStatusVariant(page.status)} className="rounded-lg capitalize">
                      {page.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Slug:</span> {page.slug}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Author:</span> {page.author}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Updated:</span>{" "}
                      {formatUpdatedAt(page.updatedAt)}
                    </p>
                  </div>
                </div>

                <AdminDemoButton
                  label="Edit page"
                  message={`Opened ${page.title} editor in demo mode.`}
                  variant="default"
                />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No CMS pages yet"
          description="Editorial entries will surface here once marketplace content is created for landing, promotional, and evergreen pages."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
