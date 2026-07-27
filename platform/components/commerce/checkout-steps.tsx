/**
 * @file CheckoutSteps — checkout flow stepper wrapper using the shared Stepper component.
 * Maps checkout phases to accessible progress states.
 */

import * as React from "react";

import { Stepper, type StepperStep } from "@/components/navigation/stepper";
import { cn } from "@/lib/utils";

export type CheckoutPhase = "bag" | "shipping" | "payment" | "review";

const phaseOrder: CheckoutPhase[] = ["bag", "shipping", "payment", "review"];

const phaseLabels: Record<CheckoutPhase, string> = {
  bag: "Bag",
  shipping: "Shipping",
  payment: "Payment",
  review: "Review",
};

export interface CheckoutStepsProps extends React.HTMLAttributes<HTMLElement> {
  current: CheckoutPhase;
  orientation?: "horizontal" | "vertical";
}

function buildSteps(current: CheckoutPhase): StepperStep[] {
  const currentIndex = phaseOrder.indexOf(current);

  return phaseOrder.map((phase, index) => ({
    id: phase,
    label: phaseLabels[phase],
    status: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}

export function CheckoutSteps({
  className,
  current,
  orientation = "horizontal",
  ...props
}: CheckoutStepsProps) {
  return (
    <Stepper
      className={cn(className)}
      steps={buildSteps(current)}
      orientation={orientation}
      {...props}
    />
  );
}
