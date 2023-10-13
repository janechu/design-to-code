import { expect, test } from "@playwright/test";

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
            const listItem = await page.locator("#guidance .list li").nth(0);

            await listItem.locator("a").click();
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
