/**
 * @file FaqAccordion — FAQ section using accessible accordion primitives.
 */

"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqAccordion({ items, title = "Frequently asked questions", className }: FaqAccordionProps) {
  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <Accordion type="single" collapsible className="mt-4">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
