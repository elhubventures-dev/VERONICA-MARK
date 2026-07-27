import { expect, test } from "@playwright/test";

test.describe("production smoke", () => {
  test("home renders brand and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("VERONICA MARK").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /shop the edit/i }).first()).toBeVisible();
  });

  test("shop and search are reachable", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    await page.goto("/search");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("account requires authentication", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("robots and sitemap respond", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<urlset");
  });

  test("health endpoint responds", async ({ request }) => {
    const health = await request.get("/api/health");
    expect([200, 503]).toContain(health.status());
    const body = await health.json();
    expect(body).toHaveProperty("status");
  });

  test("skip link exists on storefront", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toHaveCount(1);
  });
});
