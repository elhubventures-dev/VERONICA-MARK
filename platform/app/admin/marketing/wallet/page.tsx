import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingWallet } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Wallet",
  description: "Monitor Stage 9 wallet balances, credit flow, and recent ledger activity tied to incentives and store credit.",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function MarketingWalletPage() {
  const wallet = await getMarketingWallet();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Wallet"
        description="Track platform-issued credit, recent wallet movement, and active customer balances that support retention campaigns."
      />

      <section aria-label="Wallet KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Total balance</p>
          <p className="mt-2 font-display text-3xl">{formatPrice(wallet.totalBalance, wallet.currency)}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Active wallets</p>
          <p className="mt-2 font-display text-3xl">{wallet.activeWallets.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Credits (30d)</p>
          <p className="mt-2 font-display text-3xl">{formatPrice(wallet.credits30d, wallet.currency)}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Debits (30d)</p>
          <p className="mt-2 font-display text-3xl">{formatPrice(wallet.debits30d, wallet.currency)}</p>
        </article>
      </section>

      {wallet.recent.length ? (
        <section aria-label="Recent wallet ledger" className="space-y-4">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Recent ledger</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              The latest wallet credits and checkout debits attributed to loyalty, referral, and store-credit flows.
            </p>
          </div>

          <div className="space-y-3">
            {wallet.recent.map((entry) => {
              const isCredit = entry.type === "credit";

              return (
                <article
                  key={entry.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-[var(--color-foreground)]">{entry.customer}</h3>
                        <Badge variant={isCredit ? "success" : "outline"} className="rounded-lg capitalize">
                          {entry.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{entry.reason}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{formatDateTime(entry.createdAt)}</p>
                    </div>
                    <p className={isCredit ? "font-medium text-[var(--color-success)]" : "font-medium"}>
                      {isCredit ? "+" : "-"}
                      {formatPrice(entry.amount, wallet.currency)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <AdminEmptyState
          title="No wallet activity yet"
          description="Store-credit issuance and checkout wallet deductions will appear here once Stage 9 wallet incentives are in use."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}
