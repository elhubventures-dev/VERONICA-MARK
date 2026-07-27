"use client";

import { CheckCircle2, Circle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  BRAND_COMPLIANCE_ITEMS,
  GOVERNANCE_NOTE,
  type ComplianceItemId,
} from "@/lib/marketing/brand-compliance";
import { cn } from "@/lib/utils";

type BrandComplianceChecklistProps = {
  /** localStorage key scope so different surfaces can track separately */
  storageKey?: string;
  compact?: boolean;
  className?: string;
  onCompleteChange?: (complete: boolean) => void;
};

export function BrandComplianceChecklist({
  storageKey = "vm-brand-compliance",
  compact = false,
  className,
  onCompleteChange,
}: BrandComplianceChecklistProps) {
  const [checked, setChecked] = React.useState<Partial<Record<ComplianceItemId, boolean>>>({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw) as Partial<Record<ComplianceItemId, boolean>>);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persist = (next: Partial<Record<ComplianceItemId, boolean>>) => {
    setChecked(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
    const complete = BRAND_COMPLIANCE_ITEMS.every((item) => next[item.id]);
    onCompleteChange?.(complete);
  };

  const toggle = (id: ComplianceItemId) => {
    persist({ ...checked, [id]: !checked[id] });
  };

  const completedCount = BRAND_COMPLIANCE_ITEMS.filter((item) => checked[item.id]).length;
  const allComplete = completedCount === BRAND_COMPLIANCE_ITEMS.length;

  return (
    <section
      aria-labelledby="brand-compliance-heading"
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
        compact ? "p-4" : "p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)] uppercase">
            Volume VI
          </p>
          <h2 id="brand-compliance-heading" className="mt-1 font-display text-xl sm:text-2xl">
            Brand compliance checklist
          </h2>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
              Verify every item before publishing a campaign, creative, or public-facing asset.
            </p>
          ) : null}
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {completedCount}/{BRAND_COMPLIANCE_ITEMS.length} complete
          {allComplete ? (
            <span className="ml-2 font-medium text-[var(--color-success)]">Ready to publish</span>
          ) : null}
        </p>
      </div>

      <ul className={cn("mt-5 space-y-2", compact && "space-y-1.5")}>
        {BRAND_COMPLIANCE_ITEMS.map((item) => {
          const isOn = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={isOn}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                  isOn
                    ? "border-[color-mix(in_srgb,var(--color-success)_35%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-success)_6%,var(--color-surface))]"
                    : "border-[var(--color-border)] hover:bg-[var(--color-muted)]",
                )}
              >
                {isOn ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]" aria-hidden />
                ) : (
                  <Circle className="mt-0.5 size-5 shrink-0 text-[var(--color-muted-foreground)]" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{item.title}</span>
                  {!compact ? (
                    <>
                      <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
                        {item.description}
                      </span>
                      <span className="mt-1 block text-[10px] tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                        {item.reference}
                      </span>
                    </>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted-foreground)]">{GOVERNANCE_NOTE}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={!allComplete}
          onClick={() =>
            toast.success("Compliance recorded (demo)", {
              description: "Brand Management sign-off noted for this session.",
            })
          }
        >
          Record Brand Management sign-off
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            persist({});
            toast.message("Checklist cleared");
          }}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
