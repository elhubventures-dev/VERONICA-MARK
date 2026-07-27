/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
