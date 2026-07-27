import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AccountEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function AccountEmptyState({
  title,
  description,
  actionLabel = "Continue shopping",
  actionHref = "/shop",
  className,
}: AccountEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center",
        className,
      )}
    >
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted-foreground)]">{description}</p>
      {actionHref ? (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
