import { MarketingSubnav } from "@/components/marketing/marketing-subnav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <p className="mb-2 px-2 text-xs font-medium tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
          Marketing platform
        </p>
        <MarketingSubnav />
      </div>
      {children}
    </div>
  );
}
