import { expect, test } from "@playwright/test";

test.describe("textarea", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlTextarea");
            await expect(page).toHaveScreenshot();
        });
    });
});
