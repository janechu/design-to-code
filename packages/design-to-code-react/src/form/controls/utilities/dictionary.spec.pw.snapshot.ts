import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("additionalProperties", () => {
    test.describe("snapshot", () => {
        test("object", async ({ page }) => {
            await page.goto("/form?schema=keywordAdditionalPropertiesAsObject");
            await expect(page).toHaveScreenshot();
        });
        test("true", async ({ page }) => {
            await page.goto("/form?schema=keywordAdditionalPropertiesAsTrue");
            await expect(page).toHaveScreenshot();
        });
        test("false", async ({ page }) => {
            await page.goto("/form?schema=keywordAdditionalPropertiesAsFalse");
            await expect(page).toHaveScreenshot();
        });
    });
});
