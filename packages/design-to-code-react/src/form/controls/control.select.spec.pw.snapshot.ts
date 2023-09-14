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
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlSelectInvalid");
                await expect(page).toHaveScreenshot();
            });
            test("blur", async ({ page }) => {
                await page.goto("/form?schema=controlSelectInvalid");
                await page.waitForSelector(".dtc-form select");
                await page.locator(".dtc-form select").focus();
                await page.locator(".dtc-form select").blur();
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlSelectInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});
