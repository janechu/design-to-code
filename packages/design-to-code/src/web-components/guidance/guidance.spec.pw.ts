import { expect, test } from "@playwright/test";

test.describe("Guidance", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/guidance");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const guidance = await page.locator("#guidance");
        await expect(guidance).toHaveCount(1);
        await expect(await guidance.locator(".list")).toHaveCount(1);
    });

    test("should not show a document if no document has been selected", async ({
        page,
    }) => {
        const guidance = await page.locator("#guidance");
        await expect(await guidance.locator(".document")).toHaveText(
            "No document selected"
        );
    });

    test("should show a document if a document has been selected", async ({ page }) => {
        const guidance = await page.locator("#guidance");

        await guidance.locator("input").focus();

        const listItem = await guidance.locator(".list li").nth(0);

        await (await listItem.locator("a")).click();

        await page.waitForSelector(".active");

        await expect(await listItem.getAttribute("class")).toEqual("active");
        await expect(await guidance.locator(".document")).not.toHaveText(
            "No document selected"
        );
    });

    test("should filter the documents if the filter input has been filled", async ({
        page,
    }) => {
        const guidance = await page.locator("#guidance");
        const listItem = await guidance.locator(".list li");

        await expect(await listItem.count()).toEqual(4);

        const filter = await guidance.locator("input");
        await filter.fill("bb");

        await page.waitForSelector(".filtered");

        await expect(await listItem.count()).toEqual(2);
    });

    test("should clear the filter if the clear filter button has been clicked", async ({
        page,
    }) => {
        const guidance = await page.locator("#guidance");

        const filter = await guidance.locator("input");
        await filter.fill("bb");

        await page.waitForSelector(".filtered");

        const clearFilterButton = await guidance.locator("button");
        await clearFilterButton.click();

        await expect(await filter.inputValue()).toEqual("");
    });
});
