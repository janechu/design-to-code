import { expect, test } from "@playwright/test";

test.describe("textarea", () => {
    test.describe("snapshot", () => {
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlDefaultTextarea");
            await expect(page).toHaveScreenshot();
        });
    });
});
