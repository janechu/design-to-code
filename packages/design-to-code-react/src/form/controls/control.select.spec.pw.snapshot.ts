import { expect, test } from "@playwright/test";

test.describe("select", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlSelect");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlSelectDefault");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlSelectDisabled");
            await expect(page).toHaveScreenshot();
        });
    });
});
