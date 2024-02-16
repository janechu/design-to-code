import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("textarea", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlTextarea.html");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlTextareaDefault.html");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlTextareaDisabled.html");
            await expect(page).toHaveScreenshot();
        });
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlTextareaInvalid.html");
                await expect(page).toHaveScreenshot();
            });
            test("blur", async ({ page }) => {
                await page.goto("/form?schema=controlTextareaInvalid.html");
                await page.waitForSelector("textarea");
                await page.locator("textarea").focus();
                await page.locator("textarea").blur();
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlTextareaInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
            test("error list", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlTextareaInvalid&displayValidationInline=true&displayValidationErrorList=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});
