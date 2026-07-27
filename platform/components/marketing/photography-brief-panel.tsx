import { Camera } from "lucide-react";

import {
  PHOTOGRAPHY_BRIEF_SUMMARY,
  PHOTOGRAPHY_CHECKLIST,
  PHOTOGRAPHY_RULES,
} from "@/lib/marketing/photography-brief";
import { cn } from "@/lib/utils";

type PhotographyBriefPanelProps = {
  compact?: boolean;
  className?: string;
};

export function PhotographyBriefPanel({ compact = false, className }: PhotographyBriefPanelProps) {
  return (
    <section
      aria-labelledby="photography-brief-heading"
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
        compact ? "p-4" : "p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] text-[var(--color-primary)]">
          <Camera className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)] uppercase">
            Volume VI
          </p>
          <h2 id="photography-brief-heading" className="mt-1 font-display text-xl sm:text-2xl">
            Photography brief
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {PHOTOGRAPHY_BRIEF_SUMMARY}
          </p>
        </div>
      </div>

      {!compact ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {PHOTOGRAPHY_RULES.map((rule) => (
            <li key={rule.id} className="rounded-xl border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-medium">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        <h3 className="text-xs font-semibold tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
          Before upload
        </h3>
        <ul className="mt-3 space-y-2">
          {PHOTOGRAPHY_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-[var(--color-muted-foreground)]">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
