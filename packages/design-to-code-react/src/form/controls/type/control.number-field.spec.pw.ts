import { expect, test } from "@playwright/test";

test.describe("NumberFieldControl", () => {
    test("should generate an HTML input element with type number", async ({ page }) => {
        await page.goto("/form?schema=controlNumberField");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await expect(await numberField.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlNumberFieldDisabled");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await expect(await numberField.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlNumberFieldDefault");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await expect(
            (
                await numberField.getAttribute("class")
            ).includes("dtc-number-field-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlNumberField");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await numberField.fill("5");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual(5);
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlNumberFieldDefault");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await expect(await numberField.inputValue()).toEqual("42");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlNumberFieldDefault");

        await page.waitForSelector("input[type='number']");

        const numberField = await page.locator("input[type='number']");

        await numberField.fill("5");

        await expect(await numberField.inputValue()).toEqual("5");
    });
});
