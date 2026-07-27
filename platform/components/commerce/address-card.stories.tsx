import type { Meta, StoryObj } from "@storybook/react";

import { AddressCard } from "./address-card";

const meta = {
  title: "Design System/Commerce/AddressCard",
  component: AddressCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressCard>;

export default meta;
type Story = StoryObj<typeof AddressCard>;

export const Default: Story = {
  args: {
    name: "Éléonore Dubois",
    lines: ["12 Rue de la Paix", "75002 Paris", "France"],
    selected: true,
    isDefault: true,
    onEdit: () => undefined,
  },
};
