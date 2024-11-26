import { test, expect, Page } from "@playwright/test";
import exp from "constants";
import { useReducer } from "react";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
});

// test.describe("Visit Google", () => {
//   test("should match title", async ({ page }: Page) => {
//     await expect(page).toHaveTitle("Google");
//   });

//   test("search for hello world", async ({ page }: Page) => {
//     await page.getByRole("combobox").type("Hello World!", { delay: 500 });
//     await page.keyboard.press("Backspace");
//     await page.keyboard.press("Enter");
//     await expect(page).toHaveTitle("Hello World - Google Search");
//   });

//   test("search for procedure.tech", async ({ page }: Page) => {
//     await page.getByRole("combobox").type("procedure.tech", { delay: 100 });
//     await page.keyboard.press("Enter");
//     await page.getByRole("link", { url: "procedure.tech" }).click();
//     await expect(page).toHaveTitle("Home - Procedure");
//   });
// });

test.describe("League Management", () => {
  test("should have title: league management", async ({ page }) => {
    await expect(page).toHaveTitle(/RDC-2 Auction/);
  });

  test("should initially have empty table", async ({ page }) => {
    const text = await page.getByText("No leagues added");
    await expect(text).toBeVisible();
  });

  test("should have a button to add leagues", async ({ page }) => {
    const button = await page.getByRole("button", { name: "Add League" });
    await expect(button).toBeDefined();
  });

  test("should show a popover when add league button is clicked", async ({
    page,
  }) => {
    const button = await page.getByRole("button", { name: "Add League" });
    await button.click();
  });

  test("should enter league details and be able to see submit when popover is triggered", async ({
    page,
  }) => {});

  test("should add league when league details are entered and submit is clicked", async ({
    page,
  }) => {});
});
