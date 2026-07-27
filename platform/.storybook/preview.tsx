import type { Preview } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    a11y: {
      test: "todo",
    },
    backgrounds: {
      default: "cream",
      values: [
        { name: "cream", value: "#F8F4EC" },
        { name: "white", value: "#FFFFFF" },
        { name: "charcoal", value: "#121212" },
        { name: "royal-purple", value: "#4B246A" },
      ],
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-w-[320px] bg-[var(--color-background)] p-6 font-sans text-[var(--color-foreground)]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default preview;
