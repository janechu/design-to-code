import { expect, test } from "@playwright/test";

test.describe("color-picker", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/color-picker");
            await expect(page).toHaveScreenshot();
        });
    });
});
