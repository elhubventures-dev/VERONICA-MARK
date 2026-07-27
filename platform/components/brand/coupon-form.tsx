"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

type CouponDraft = {
  title: string;
  code: string;
  value: string;
};

const initialDraft: CouponDraft = {
  title: "",
  code: "",
  value: "",
};

export function CouponForm() {
  const [draft, setDraft] = React.useState<CouponDraft>(initialDraft);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastCreatedCode, setLastCreatedCode] = React.useState<string | null>(null);

  function updateField<K extends keyof CouponDraft>(field: K, value: CouponDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = draft.title.trim();
    const code = draft.code.trim().toUpperCase();
    const value = Number(draft.value);

    if (!title || !code || !draft.value.trim()) {
      toast.error("Complete the coupon title, code, and discount.");
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid percentage discount.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    setLastCreatedCode(code);
    setDraft(initialDraft);
    toast.success(`Coupon ${code} created.`, {
      description: `${title} was added as a demo promotion with ${value}% off.`,
    });
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Create coupon</CardTitle>
            <CardDescription>Spin up a demo offer for previews, QA, or internal reviews.</CardDescription>
          </div>
          <Badge variant="outline">Demo only</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="coupon-title">Campaign title</Label>
            <Input
              id="coupon-title"
              placeholder="Private atelier launch"
              value={draft.title}
              onChange={(event) => updateField("title", event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon code</Label>
              <Input
                id="coupon-code"
                placeholder="ATELIER20"
                value={draft.code}
                onChange={(event) => updateField("code", event.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-value">Discount %</Label>
              <Input
                id="coupon-value"
                type="number"
                min="1"
                max="100"
                placeholder="20"
                value={draft.value}
                onChange={(event) => updateField("value", event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create coupon"}
            </Button>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Demo actions trigger a toast but do not persist changes.
            </p>
          </div>
        </form>

        {lastCreatedCode ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 px-4 py-3 text-sm">
            <span className="text-[var(--color-muted-foreground)]">Latest demo coupon:</span>{" "}
            <span className="font-medium">{lastCreatedCode}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
