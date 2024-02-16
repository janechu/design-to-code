import { expect, test } from "../../__test__/base-fixtures.js";

test.describe("AJV Validator Messages", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/ajv-validator-messages.html");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const ajvValidatorMessages = await page.locator("#validator");
        await expect(ajvValidatorMessages).toHaveCount(1);
        await expect(ajvValidatorMessages.locator(".root")).toBeVisible();
    });

    test("should show an error message", async ({ page }) => {
        const ajvValidatorMessages = await page.locator("#validator");
        const errors = ajvValidatorMessages.locator(".error");
        await expect(errors).toHaveCount(1);
    });
    test("should show a success message", async ({ page }) => {
        const showSuccessButton = await page.locator("#showSuccess");
        const setValidButton = await page.locator("#setValidData");

        await showSuccessButton.click();
        await setValidButton.click();

        const ajvValidatorMessages = await page.locator("#validator");
        const errors = ajvValidatorMessages.locator(".error");

        await expect(errors).toHaveCount(0);

        const success = ajvValidatorMessages.locator(".success");

        await expect(success).toHaveCount(1);
    });
    test("should not show any messages", async ({ page }) => {
        const setValidButton = await page.locator("#setValidData");

        await setValidButton.click();

        const ajvValidatorMessages = await page.locator("#validator");
        const errors = ajvValidatorMessages.locator(".error");

        await expect(errors).toHaveCount(0);

        const success = ajvValidatorMessages.locator(".success");

        await expect(success).toHaveCount(0);
    });
});
