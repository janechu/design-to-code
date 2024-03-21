import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("KeywordAdditionalProperties", () => {
    test("should generate an add control if additionalProperties is an object with type is specified", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsObject");

        await page.waitForSelector(".dtc-form .dtc-dictionary_control-region");

        const dictionary = await page.locator(".dtc-form .dtc-dictionary_control-region");

        await expect(await dictionary.count()).toEqual(1);

        await expect(
            await dictionary.locator("button.dtc-dictionary_control-add-trigger").count()
        ).toEqual(1);
    });
    test("should add a control if the object with type is specified", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsObject");

        await page.waitForSelector(".dtc-form .dtc-dictionary_control-region");

        const dictionaryItems = page.locator(".dtc-dictionary_item-control-region");

        await expect(await dictionaryItems.count()).toEqual(0);

        await page.locator("button.dtc-dictionary_control-add-trigger").click();

        await expect(await dictionaryItems.count()).toEqual(1);
    });
    test("should generate an add control if additionalProperties is true", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsTrue");

        await page.waitForSelector(".dtc-form .dtc-dictionary_control-region");

        const dictionary = await page.locator(".dtc-form .dtc-dictionary_control-region");

        await expect(await dictionary.count()).toEqual(1);

        await expect(
            await dictionary.locator("button.dtc-dictionary_control-add-trigger").count()
        ).toEqual(1);
    });
    test("should add an untyped control if additionalProperties is true", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsTrue");

        await page.waitForSelector(".dtc-form .dtc-dictionary_control-region");

        const dictionaryItems = page.locator(".dtc-dictionary_item-control-region");

        await expect(await dictionaryItems.count()).toEqual(0);

        await page.locator("button.dtc-dictionary_control-add-trigger").click();

        await expect(await dictionaryItems.count()).toEqual(1);

        await expect(await page.locator(".dtc-untyped-control").count()).toEqual(1);
    });
    test("should not generate controls if additionalProperties is false", async ({
        page,
    }) => {
        await page.goto("/form?schema=keywordAdditionalPropertiesAsFalse");

        const dictionaryControl = await page.locator(
            ".dtc-form .dtc-dictionary_control-region"
        );

        await expect(await dictionaryControl.count()).toEqual(0);
    });
});
