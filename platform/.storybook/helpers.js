import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

/** @type { import('storybook/internal/types').StorybookConfig['viteFinal'] } */
export async function viteFinal(config) {
  return config;
}

export function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
