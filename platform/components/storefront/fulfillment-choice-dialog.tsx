"use client";

import { MapPin, Truck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  STORE_PICKUP_LOCATION,
  type FulfillmentMode,
} from "@/lib/commerce/fulfillment";
import { cn } from "@/lib/utils";

type FulfillmentChoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mode: FulfillmentMode) => void;
};

const options: Array<{
  mode: FulfillmentMode;
  title: string;
  description: string;
  icon: typeof MapPin;
}> = [
  {
    mode: "store_pickup",
    title: "Store pickup",
    description: `Collect in ${STORE_PICKUP_LOCATION.city} — no delivery fee or address needed.`,
    icon: MapPin,
  },
  {
    mode: "delivery",
    title: "Delivery",
    description: "Ship to your address with our standard delivery options.",
    icon: Truck,
  },
];

export function FulfillmentChoiceDialog({
  open,
  onOpenChange,
  onSelect,
}: FulfillmentChoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How would you like to receive your order?</DialogTitle>
          <DialogDescription>
            Choose store pickup in Port Harcourt, or delivery to your address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-2" role="list">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.mode}
                type="button"
                role="listitem"
                onClick={() => onSelect(option.mode)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition-[border-color,transform,box-shadow] duration-300",
                  "hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-border))] hover:shadow-[var(--shadow-subtle)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                )}
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-tight">{option.title}</span>
                  <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
