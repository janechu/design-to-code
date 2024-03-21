import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("KeywordAdditionalProperties", () => {
    test("should generate controls if additionalProperties is an object with type specified", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsObject");

        await page.waitForSelector(".dtc-form a.dtc-dictionary");

        const dictionary = await page.locator(".dtc-form a.dtc-dictionary");

        await expect(await dictionary.count()).toEqual(1);
    });
    // test("should generate controls if additionalProperties is true", async ({ page }) => {
    //     await page.goto("/form?schema=keywordAdditionalPropertiesAsTrue");

    //     await page.waitForSelector(".dtc-form a.dtc-section-link-control");

    //     const link = await page.locator(".dtc-form a.dtc-section-link-control");

    //     await expect(await link.count()).toEqual(1);
    // });
    // test("should not generate controls if additionalProperties is false", async ({ page }) => {
    //     await page.goto("/form?schema=keywordAdditionalPropertiesAsFalse");

    //     await page.waitForSelector(".dtc-form a.dtc-section-link-control");

    //     const link = await page.locator(".dtc-form a.dtc-section-link-control");

    //     await expect(await link.count()).toEqual(1);
    // });
});
