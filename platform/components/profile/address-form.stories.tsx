import type { Meta, StoryObj } from "@storybook/react";

import { AddressForm } from "./address-form";

const meta = {
  title: "Design System/Profile/AddressForm",
  component: AddressForm,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof AddressForm>;

export const Default: Story = {
  args: {
        "defaultValues": {
        "line1": "12 Rue de la Paix",
        "city": "Paris",
        "postalCode": "75002",
        "country": "France"
    }
  },
};
