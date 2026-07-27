import type { Meta, StoryObj } from "@storybook/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta = {
  title: "Design System/UI/Accordion",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Veronica Mark?</AccordionTrigger>
        <AccordionContent>A luxury managed-brand marketplace platform.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I onboard a brand?</AccordionTrigger>
        <AccordionContent>Contact enterprise sales to begin onboarding.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Global luxury shipping options.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30-day premium return policy.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};