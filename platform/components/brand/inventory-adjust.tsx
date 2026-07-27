"use client";

import * as React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { adjustBrandInventoryAction } from "@/lib/brand/actions";

type InventoryAdjustProps = {
  sku: string;
  variantId?: string;
  initialOnHand: number;
  initialReserved: number;
};

export function InventoryAdjust({
  sku,
  variantId,
  initialOnHand,
  initialReserved,
}: InventoryAdjustProps) {
  const [onHand, setOnHand] = React.useState(initialOnHand);
  const [pending, setPending] = React.useState(false);

  async function applyDelta(delta: number) {
    if (!variantId) {
      toast.message("Demo inventory only", {
        description: "Sign in as an assigned Brand Manager with live SKUs to persist stock changes.",
      });
      const nextOnHand = Math.max(initialReserved, onHand + delta);
      setOnHand(nextOnHand);
      return;
    }

    setPending(true);
    const previous = onHand;
    setOnHand(Math.max(initialReserved, onHand + delta));

    const result = await adjustBrandInventoryAction({
      variantId,
      quantityDelta: delta,
    });

    if (!result.ok) {
      setOnHand(previous);
      toast.error(result.message);
    } else {
      const available =
        typeof result.data?.available === "number" ? result.data.available : Math.max(0, previous + delta - initialReserved);
      setOnHand(available + initialReserved);
      toast.success("Inventory updated", {
        description: `${sku} · ${available} available`,
      });
    }
    setPending(false);
  }

  function handleReset() {
    setOnHand(initialOnHand);
    toast.success("Inventory view reset", {
      description: `${sku} returned to the last loaded quantity (no write).`,
    });
  }

  return (
    <div className="flex min-w-[11rem] items-center justify-end gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 w-8 rounded-lg px-0"
        aria-label={`Decrease stock for ${sku}`}
        disabled={pending || onHand <= initialReserved}
        onClick={() => void applyDelta(-1)}
      >
        <Minus aria-hidden />
      </Button>
      <div className="min-w-[3.25rem] rounded-lg border border-[var(--color-border)] px-2 py-1 text-center text-sm font-medium">
        {onHand}
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 w-8 rounded-lg px-0"
        aria-label={`Increase stock for ${sku}`}
        disabled={pending}
        onClick={() => void applyDelta(1)}
      >
        <Plus aria-hidden />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 rounded-lg px-2"
        aria-label={`Reset stock for ${sku}`}
        disabled={pending}
        onClick={handleReset}
      >
        <RotateCcw aria-hidden />
      </Button>
    </div>
  );
}
