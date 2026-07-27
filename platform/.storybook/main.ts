import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../docs/design-system/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  async viteFinal(config) {
    const root = path.resolve(dirname, "..");
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": root,
    };
    return config;
  },
};

export default config;
