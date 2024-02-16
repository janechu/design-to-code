import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("untyped", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlUntyped.html");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlUntypedDefault.html");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlUntypedDisabled.html");
            await expect(page).toHaveScreenshot();
        });
    });
});
