import { expect, test } from "@playwright/test";

test.describe("button", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlButton");
            await expect(page).toHaveScreenshot();
        });
        test.skip("default", async ({ page }) => {
            // build gate is failing on this
            await page.goto("/form?schema=controlButtonDefault");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlButtonDisabled");
            await expect(page).toHaveScreenshot();
        });
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlButtonInvalid");
                await expect(page).toHaveScreenshot();
            });
            test("blur", async ({ page }) => {
                await page.goto("/form?schema=controlButtonInvalid");
                await page.waitForSelector(".dtc-form .dtc-button-control");
                await page.locator(".dtc-form .dtc-button-control").focus();
                await page.locator(".dtc-form .dtc-button-control").blur();
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlButtonInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
            test("error list", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlButtonInvalid&displayValidationInline=true&displayValidationErrorList=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});
