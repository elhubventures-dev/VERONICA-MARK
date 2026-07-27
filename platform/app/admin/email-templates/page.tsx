import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminEmailTemplates } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Email Templates",
  description: "Review lifecycle messaging, preview campaign variants, and coordinate transactional template updates.",
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getChannelVariant(channel: "transactional" | "marketing" | "operational") {
  return channel === "transactional" ? "secondary" : channel === "marketing" ? "accent" : "outline";
}

export default async function AdminEmailTemplatesPage() {
  const templates = await getAdminEmailTemplates();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Email templates"
        description="Keep platform communications on-brand across order updates, account recovery flows, and growth campaigns for every locale."
      />

      {templates.length ? (
        <section aria-label="Email template library" className="grid gap-4 xl:grid-cols-2">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{template.name}</h2>
                    <Badge variant={getChannelVariant(template.channel)} className="rounded-lg capitalize">
                      {template.channel}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg uppercase">
                      {template.locale}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Template key:</span> {template.key}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Updated:</span>{" "}
                      {formatTimestamp(template.updatedAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                    <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                      Preview context
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                      Use this template to validate brand voice, legal copy, and locale-specific formatting before
                      publishing to production mail flows.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminDemoButton
                    label="Preview"
                    message={`${template.name} preview opened in demo mode.`}
                    variant="default"
                  />
                  <AdminDemoButton
                    label="Edit"
                    message={`${template.name} editor opened in demo mode.`}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No templates yet"
          description="Transactional and marketing templates will appear here after the messaging catalog is seeded."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
