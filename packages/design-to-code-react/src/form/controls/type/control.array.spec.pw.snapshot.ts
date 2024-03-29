import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("array", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlArray");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlArrayDefault");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlArrayDisabled");
            await expect(page).toHaveScreenshot();
        });
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlArrayInvalid");
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlArrayInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
            test("error list", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlArrayInvalid&displayValidationInline=true&displayValidationErrorList=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});
