import { expect, test } from "@playwright/test";

test.describe("foundation storefront", () => {
  test("renders brand hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("VERONICA MARK").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /shop the edit/i }).first()).toBeVisible();
  });
});
