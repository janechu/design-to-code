import { expect, test } from "../../../__tests__/base-fixtures";

test.describe("section", () => {
    test.describe("snapshot", () => {
        test("one-of", async ({ page }) => {
            await page.goto("/form?schema=controlSectionOneOf");
            await expect(page).toHaveScreenshot();
        });
    });
});
