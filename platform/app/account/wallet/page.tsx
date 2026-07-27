import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightLeft, CreditCard, Wallet } from "lucide-react";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountWallet } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Review your VERONICA MARK wallet balance and store credit history.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AccountWalletPage() {
  const wallet = await getAccountWallet();
  const hasBalance = wallet.balance > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Benefits"
        title="Wallet"
        description="Use store credit on future orders and keep a clear record of every credit and debit."
        actions={
          <Button asChild>
            <Link href="/shop">Spend balance</Link>
          </Button>
        }
      />

      <section aria-label="Wallet overview" className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardDescription>Available store credit</CardDescription>
            <CardTitle className="flex items-center gap-3 text-4xl">
              <Wallet className="size-6 text-[var(--color-primary)]" aria-hidden />
              {formatCurrency(wallet.balance, wallet.currency)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasBalance ? (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-5">
                <p className="font-medium">Ready to apply at checkout</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted-foreground)]">
                  Your balance will be available automatically during checkout on eligible orders.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/cart">Go to cart</Link>
                </Button>
              </div>
            ) : (
              <AccountEmptyState
                className="px-0 py-10"
                title="Your wallet is empty"
                description="Once you receive store credit from returns, referrals, or promotions, it will appear here and be ready to use at checkout."
                actionLabel="Continue shopping"
                actionHref="/shop"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5 text-[var(--color-primary)]" aria-hidden />
              Wallet details
            </CardTitle>
            <CardDescription>Quick context for your current credit position.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span className="text-sm text-[var(--color-muted-foreground)]">Currency</span>
              <span className="font-medium">{wallet.currency}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span className="text-sm text-[var(--color-muted-foreground)]">Transactions</span>
              <span className="font-medium">{wallet.transactions.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span className="text-sm text-[var(--color-muted-foreground)]">Balance status</span>
              <Badge variant={hasBalance ? "success" : "outline"}>{hasBalance ? "Available" : "Zero balance"}</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="wallet-transactions-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="wallet-transactions-heading" className="font-display text-2xl">
              Wallet transactions
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Credits increase your balance and debits are applied during checkout.
            </p>
          </div>
        </div>

        {wallet.transactions.length ? (
          <div className="space-y-3">
            {wallet.transactions.map((transaction) => {
              const positive = transaction.type === "credit";

              return (
                <Card key={transaction.id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]"
                        aria-hidden
                      >
                        <ArrowRightLeft className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={positive ? "success" : "outline"} className="capitalize">
                        {transaction.type}
                      </Badge>
                      <span className={positive ? "font-medium text-[var(--color-success)]" : "font-medium"}>
                        {positive ? "+" : "-"}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <AccountEmptyState
            title="No wallet transactions yet"
            description="Credits and checkout deductions will appear here once your wallet is active."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        )}
      </section>
    </div>
  );
}
