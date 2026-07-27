import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { SiteHeader } from "./site-header";

const meta = {
  title: "Design System/Layout/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {
  args: {
    navigation: (
      <nav aria-label="Primary" className="flex gap-6 text-sm">
        {["Shop", "Maison", "Journal"].map((item) => (
          <span key={item} className="text-[var(--color-muted-foreground)]">
            {item}
          </span>
        ))}
      </nav>
    ),
    utilities: (
      <>
        <Button variant="ghost" size="sm">
          Account
        </Button>
        <Button variant="outline" size="sm">
          Bag (2)
        </Button>
      </>
    ),
  },
};
