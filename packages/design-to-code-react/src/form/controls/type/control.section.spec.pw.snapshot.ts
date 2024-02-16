import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("section", () => {
    test.describe("snapshot", () => {
        test("one-of", async ({ page }) => {
            await page.goto("/form?schema=controlSectionOneOf.html");
            await expect(page).toHaveScreenshot();
        });
    });
});
