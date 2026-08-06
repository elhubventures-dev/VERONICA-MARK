/**
 * @file CheckoutSteps — checkout flow stepper wrapper using the shared Stepper component.
 * Maps checkout phases to accessible progress states.
 */

import * as React from "react";

import { Stepper, type StepperStep } from "@/components/navigation/stepper";
import type { FulfillmentMode } from "@/lib/commerce/fulfillment";
import { cn } from "@/lib/utils";

export type CheckoutPhase = "bag" | "shipping" | "payment" | "review";

const phaseOrder: CheckoutPhase[] = ["bag", "shipping", "payment", "review"];

function phaseLabels(fulfillment: FulfillmentMode): Record<CheckoutPhase, string> {
  return {
    bag: "Bag",
    shipping: fulfillment === "store_pickup" ? "Contact" : "Shipping",
    payment: "Payment",
    review: "Review",
  };
}

export interface CheckoutStepsProps extends React.HTMLAttributes<HTMLElement> {
  current: CheckoutPhase;
  orientation?: "horizontal" | "vertical";
  fulfillment?: FulfillmentMode;
}

function buildSteps(current: CheckoutPhase, fulfillment: FulfillmentMode): StepperStep[] {
  const currentIndex = phaseOrder.indexOf(current);
  const labels = phaseLabels(fulfillment);

  return phaseOrder.map((phase, index) => ({
    id: phase,
    label: labels[phase],
    status: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}

export function CheckoutSteps({
  className,
  current,
  orientation = "horizontal",
  fulfillment = "delivery",
  ...props
}: CheckoutStepsProps) {
  return (
    <Stepper
      className={cn(className)}
      steps={buildSteps(current, fulfillment)}
      orientation={orientation}
      {...props}
    />
  );
}
