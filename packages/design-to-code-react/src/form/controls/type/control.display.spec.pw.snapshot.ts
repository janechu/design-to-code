import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("display", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlDisplay.html");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlDisplayDefault.html");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlDisplayDisabled.html");
            await expect(page).toHaveScreenshot();
        });
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlDisplayInvalid.html");
                await expect(page).toHaveScreenshot();
            });
            test("blur", async ({ page }) => {
                await page.goto("/form?schema=controlDisplayInvalid.html");
                await page.waitForSelector(".dtc-form input");
                await page.locator(".dtc-form input").focus();
                await page.locator(".dtc-form input").blur();
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlDisplayInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
            test("error list", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlDisplayInvalid&displayValidationInline=true&displayValidationErrorList=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});
