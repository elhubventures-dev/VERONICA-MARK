import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { QuantitySelector } from "./quantity-selector";

const meta = {
  title: "Design System/Commerce/QuantitySelector",
  component: QuantitySelector,
  tags: ["autodocs"],
} satisfies Meta<typeof QuantitySelector>;

export default meta;
type Story = StoryObj<typeof QuantitySelector>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(1);
    return <QuantitySelector value={value} onChange={setValue} />;
  },
};
