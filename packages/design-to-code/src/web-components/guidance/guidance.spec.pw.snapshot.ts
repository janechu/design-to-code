import { expect, test } from "../../__test__/base-fixtures";

test.describe("guidance", () => {
    test.describe("snapshot", () => {
        test("no document selected", async ({ page }) => {
            await page.goto("/guidance");
            await page.locator("#guidance").waitFor({ state: "visible" });
            await expect(page).toHaveScreenshot();
        });
        test("document selected", async ({ page }) => {
            await page.goto("/guidance");
            await page.locator("#guidance").waitFor({ state: "visible" });

            const filter = await page.locator("#guidance input");
            await filter.focus();

            const listItem = await page.locator("#guidance .list li").nth(0);

            await (await listItem.locator("a")).click();
            await expect(page).toHaveScreenshot();
        });
        test("documents filtered", async ({ page }) => {
            await page.goto("/guidance");
            await page.locator("#guidance").waitFor({ state: "visible" });

            const filter = await page.locator("#guidance input");
            await filter.fill("bb");

            await expect(page).toHaveScreenshot();
        });
    });
});
