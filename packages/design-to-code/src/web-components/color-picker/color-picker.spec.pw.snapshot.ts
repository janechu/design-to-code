import { expect, test } from "../../__test__/base-fixtures.js";

test.describe("color-picker", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/color-picker.html");
            await expect(page).toHaveScreenshot();
        });
    });
});
