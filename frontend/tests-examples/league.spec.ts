import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }: Page) => {
  await page.goto("https://www.google.com");
});

test.describe("Visit Google", () => {
  test("should match title", async ({ page }: Page) => {
    await expect(page).toHaveTitle("Google");
  });
});
