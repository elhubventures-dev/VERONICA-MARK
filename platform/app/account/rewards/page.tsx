import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles, TrendingUp } from "lucide-react";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountRewards } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Track your VERONICA MARK points, tier progress, and reward activity.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountRewardsPage() {
  const rewards = await getAccountRewards();
  const progress = Math.max(
    0,
    Math.min(100, Math.round((rewards.points / (rewards.points + rewards.pointsToNextTier)) * 100)),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Benefits"
        title="Rewards"
        description="See your current tier, points balance, and every reward movement in one place."
        actions={
          <Button asChild>
            <Link href="/shop">Earn more points</Link>
          </Button>
        }
      />

      <section aria-label="Reward summary" className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current balance</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Gift className="size-5 text-[var(--color-primary)]" aria-hidden />
              {rewards.points.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Member tier</CardDescription>
            <CardTitle className="flex items-center gap-3 text-3xl">
              {rewards.tier}
              <Badge variant="accent">Active</Badge>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Points to next tier</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <TrendingUp className="size-5 text-[var(--color-primary)]" aria-hidden />
              {rewards.pointsToNextTier.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-[var(--color-primary)]" aria-hidden />
              Progress to {rewards.nextTier}
            </CardTitle>
            <CardDescription>
              You are {rewards.pointsToNextTier.toLocaleString()} points away from unlocking the next member tier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-muted-foreground)]">{rewards.tier}</span>
                <span className="font-medium">{progress}% complete</span>
                <span className="text-[var(--color-muted-foreground)]">{rewards.nextTier}</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-3 rounded-full bg-[var(--color-primary)] transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-5">
              <p className="font-medium">Keep momentum on your next order</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-muted-foreground)]">
                Once you reach {rewards.nextTier}, you can unlock higher-value benefits and a more elevated account experience.
              </p>
              <Button asChild className="mt-4">
                <Link href="/shop">
                  Explore the latest edit
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How points move</CardTitle>
            <CardDescription>Orders add points, while selected benefits can redeem them.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Earn on eligible purchases</span>
              <Badge variant="success">+ points</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Redeem for selected benefits</span>
              <Badge variant="outline">- points</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Track every movement below</span>
              <Badge variant="accent">Live ledger</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="rewards-history-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="rewards-history-heading" className="font-display text-2xl">
              Reward activity
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              A complete history of points earned and redeemed.
            </p>
          </div>
        </div>

        {rewards.transactions.length ? (
          <div className="space-y-3">
            {rewards.transactions.map((transaction) => {
              const positive = transaction.points >= 0;

              return (
                <Card key={transaction.id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <Badge variant={positive ? "success" : "outline"} className="justify-center px-3 py-1 text-sm">
                      {positive ? "+" : ""}
                      {transaction.points.toLocaleString()} pts
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <AccountEmptyState
            title="No reward activity yet"
            description="Your points history will appear here after your first eligible purchase."
            actionLabel="Shop eligible products"
            actionHref="/shop"
          />
        )}
      </section>
    </div>
  );
}
