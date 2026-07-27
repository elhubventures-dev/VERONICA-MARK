import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReturnStatusBadge } from "@/components/account/return-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAccountOrder, getAccountReturn } from "@/lib/account/queries";

type AccountReturnDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AccountReturnDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Return ${id}`,
    description: `Track the status and refund details for return ${id}.`,
  };
}

function formatRequestedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReturnStepLabels(status: string) {
  return [
    "Request received",
    "Approved for shipment",
    "Package received",
    status === "rejected" ? "Return closed" : "Refund completed",
  ];
}

export default async function AccountReturnDetailPage({
  params,
}: AccountReturnDetailPageProps) {
  const { id } = await params;
  const entry = await getAccountReturn(id);

  if (!entry) {
    notFound();
  }

  const order = await getAccountOrder(entry.orderNumber);
  const reachedStepIndex =
    {
      requested: 0,
      approved: 1,
      received: 2,
      refunded: 3,
      rejected: 3,
    }[entry.status] ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title={`Return ${entry.id}`}
        description={`Requested on ${formatRequestedAt(entry.requestedAt)} for order ${entry.orderNumber}.`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/account/returns">Back to returns</Link>
            </Button>
            <Button asChild>
              <Link href={`/account/orders/${entry.orderNumber}`}>Open order</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Return status</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ReturnStatusBadge status={entry.status} />
                <Badge variant="outline" className="rounded-lg">
                  Order {entry.orderNumber}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <a
                href={`mailto:concierge@veronicamark.com?subject=${encodeURIComponent(`Return update ${entry.id}`)}`}
              >
                Contact concierge
              </a>
            </Button>
          </div>

          <ol className="mt-6 space-y-4">
            {getReturnStepLabels(entry.status).map((label, index) => {
              const complete = index <= reachedStepIndex;
              return (
                <li key={label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={[
                        "mt-1 block size-3 rounded-full border",
                        complete
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-[var(--color-border)] bg-[var(--color-muted)]",
                      ].join(" ")}
                      aria-hidden
                    />
                    {index < 3 ? (
                      <span className="mt-2 block w-px flex-1 bg-[var(--color-border)]" aria-hidden />
                    ) : null}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {index === 0 ? formatRequestedAt(entry.requestedAt) : complete ? "Completed" : "Pending"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Refund summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Requested on</dt>
                <dd>{formatRequestedAt(entry.requestedAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Refund amount</dt>
                <dd>
                  <Price amount={entry.refundAmount} currency={entry.currency} size="md" />
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Reason</dt>
                <dd className="max-w-[12rem] text-right">{entry.reason}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Next step</h2>
            <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
              {entry.status === "requested" && "Your request is awaiting concierge review."}
              {entry.status === "approved" &&
                "Please package the approved items securely and follow the instructions from concierge."}
              {entry.status === "received" &&
                "Your return has arrived and the refund is being finalized."}
              {entry.status === "refunded" && "Your refund has been completed and no further action is needed."}
              {entry.status === "rejected" &&
                "This return was closed. Contact concierge if you need to challenge the decision."}
            </p>
          </section>
        </aside>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Returned items</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Review the items included in this return request.
            </p>
          </div>
          {order ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/account/orders/${order.orderNumber}`}>Open original order</Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-6 space-y-3">
          {entry.items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] p-4"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  Quantity {item.quantity}
                </p>
              </div>
              <Badge variant="outline" className="rounded-lg">
                Included in request
              </Badge>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
