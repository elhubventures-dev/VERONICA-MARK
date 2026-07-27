import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { VariantSelector } from "./variant-selector";

const meta = {
  title: "Design System/Commerce/VariantSelector",
  component: VariantSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof VariantSelector>;

export default meta;
type Story = StoryObj<typeof VariantSelector>;

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = React.useState("50ml");
    return (
      <VariantSelector
        label="Concentration & Size"
        value={value}
        onChange={setValue}
        variants={[
          { id: "30ml", label: "30ml Travel" },
          { id: "50ml", label: "50ml EDP" },
          { id: "100ml", label: "100ml EDP" },
          { id: "200ml", label: "200ml Refill", available: false },
        ]}
      />
    );
  },
};
