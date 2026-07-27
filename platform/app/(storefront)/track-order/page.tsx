import { TrackOrderForm } from "@/components/storefront/track-order-form";
import { Reveal } from "@/components/storefront/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Track Your Order",
  description: "Track a VERONICA MARK order using your reference and email.",
  path: "/track-order",
  noIndex: true,
});

export default function TrackOrderPage() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Client services
        </p>
        <h1 className="mt-4 text-5xl">Track your order</h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          Enter the details from your order confirmation to see its latest status.
        </p>
        <TrackOrderForm />
      </Reveal>
    </section>
  );
}
