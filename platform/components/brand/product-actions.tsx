"use client";

import * as React from "react";
import Link from "next/link";
import { Archive, PencilLine, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { updateBrandProductStatusAction } from "@/lib/brand/actions";
import type { BrandProductStatus } from "@/lib/brand/demo-data";

type ProductActionsProps = {
  productId: string;
  productName: string;
  initialStatus: BrandProductStatus;
};

function getStatusVariant(status: BrandProductStatus) {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "outline";
  }
}

export function ProductActions({ productId, productName, initialStatus }: ProductActionsProps) {
  const [status, setStatus] = React.useState<BrandProductStatus>(initialStatus);
  const [pending, setPending] = React.useState(false);

  async function setProductStatus(next: BrandProductStatus) {
    setPending(true);
    const previous = status;
    setStatus(next);

    const result = await updateBrandProductStatusAction({
      productId,
      status: next,
    });

    if (!result.ok) {
      setStatus(previous);
      toast.error(result.message);
    } else {
      toast.success(result.message, { description: productName });
    }
    setPending(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={getStatusVariant(status)} className="rounded-lg capitalize">
        Status: {status}
      </Badge>
      <Button asChild variant="outline" size="sm">
        <Link href={`/brand/products/${productId}/edit`}>
          <PencilLine aria-hidden />
          Edit product
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() => void setProductStatus(status === "archived" ? "draft" : "archived")}
      >
        {status === "archived" ? <RotateCcw aria-hidden /> : <Archive aria-hidden />}
        {status === "archived" ? "Restore draft" : "Archive"}
      </Button>
    </div>
  );
}
