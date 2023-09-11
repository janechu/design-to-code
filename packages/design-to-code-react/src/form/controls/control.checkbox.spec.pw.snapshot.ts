import { expect, test } from "@playwright/test";

test.describe("checkbox", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlCheckbox");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlCheckboxDefault");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlCheckboxDisabled");
            await expect(page).toHaveScreenshot();
        });
    });
});
