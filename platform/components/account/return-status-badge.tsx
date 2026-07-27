import { Badge } from "@/components/ui/badge";

type ReturnStatus = "requested" | "approved" | "received" | "refunded" | "rejected";

const statusConfig: Record<
  ReturnStatus,
  { label: string; variant: "secondary" | "accent" | "success" | "warning" | "error" }
> = {
  requested: { label: "Requested", variant: "warning" },
  approved: { label: "Approved", variant: "accent" },
  received: { label: "Received", variant: "secondary" },
  refunded: { label: "Refunded", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className="rounded-lg">
      {config.label}
    </Badge>
  );
}
