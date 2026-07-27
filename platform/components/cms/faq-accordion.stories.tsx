import type { Meta, StoryObj } from "@storybook/react";

import { FaqAccordion } from "./faq-accordion";

const meta = {
  title: "Design System/Cms/FaqAccordion",
  component: FaqAccordion,
  tags: ["autodocs"],
} satisfies Meta<typeof FaqAccordion>;

export default meta;
type Story = StoryObj<typeof FaqAccordion>;

export const Default: Story = {
  args: {
        "items": [
        {
            "id": "1",
            "question": "How do I track my order?",
            "answer": "You'll receive tracking details by email once your brand ships."
        }
    ]
  },
};
