import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const serious = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(
    serious,
    serious
      .map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)
      .join("\n"),
  ).toEqual([]);
}

test.describe("critical flow accessibility", () => {
  test("home has no serious axe violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("cart (checkout precursor) has no serious axe violations", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("checkout gate (auth) has no serious axe violations", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/auth\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("account nav gate (sign-in) has no serious axe violations", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expectNoSeriousViolations(page);
  });
});
