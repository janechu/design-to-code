import { expect, test } from "@playwright/test";

test.describe("ajv-validator-messages", () => {
    test.describe("snapshot", () => {
        test("error", async ({ page }) => {
            await page.goto("/ajv-validator-messages");
            await expect(page).toHaveScreenshot();
        });
        test("success", async ({ page }) => {
            await page.goto("/ajv-validator-messages");

            const showSuccessButton = await page.locator("#showSuccess");
            const setValidButton = await page.locator("#setValidData");

            await showSuccessButton.click();
            await setValidButton.click();

            await expect(page).toHaveScreenshot();
        });
    });
});
