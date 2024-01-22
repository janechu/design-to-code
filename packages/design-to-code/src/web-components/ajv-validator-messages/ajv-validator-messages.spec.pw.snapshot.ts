import { expect, test } from "../../__test__/base-fixtures";

test.describe.skip("ajv-validator-messages", () => {
    test.describe("snapshot", () => {
        test("error", async ({ page }) => {
            await page.goto("/ajv-validator-messages");
            await page.locator("#validator").waitFor({ state: "visible" });
            await expect(page).toHaveScreenshot();
        });
        test("success", async ({ page }) => {
            await page.goto("/ajv-validator-messages");
            await page.locator("#validator").waitFor({ state: "visible" });

            const showSuccessButton = await page.locator("#showSuccess");
            const setValidButton = await page.locator("#setValidData");

            await showSuccessButton.click();
            await setValidButton.click();

            await expect(page).toHaveScreenshot();
        });
        test("schema error", async ({ page }) => {
            await page.goto("/ajv-validator-messages");
            await page.locator("#validator").waitFor({ state: "visible" });

            const setInvalidSchemaButton = await page.locator("#setInvalidSchema");

            await setInvalidSchemaButton.click();

            await expect(page).toHaveScreenshot();
        });
    });
});
