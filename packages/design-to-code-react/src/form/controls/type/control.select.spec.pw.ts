import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("SelectControl", () => {
    test("should generate an HTML select element", async ({ page }) => {
        await page.goto("/form?schema=controlSelect");

        await page.waitForSelector(".dtc-form select");

        const select = await page.locator(".dtc-form select");

        await expect(await select.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlSelectDisabled");

        await page.waitForSelector(".dtc-form select");

        const select = await page.locator(".dtc-form select");

        await expect(await select.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlSelectDefault");

        await page.waitForSelector(".dtc-form select");

        const selectContainer = await page.locator(".dtc-select-control");

        await expect(
            (
                await selectContainer.getAttribute("class")
            ).includes("dtc-select-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlSelect");

        await page.waitForSelector(".dtc-form select");

        const select = await page.locator(".dtc-form select");

        await select.selectOption("bar");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("bar");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlSelectDefault");

        await page.waitForSelector(".dtc-form select");

        const select = await page.locator(".dtc-form select");

        await expect(await select.inputValue()).toEqual("bar");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlSelectDefault");

        await page.waitForSelector(".dtc-form select");

        const select = await page.locator(".dtc-form select");

        await select.selectOption("foo");

        await expect(await select.inputValue()).toEqual("foo");
    });
    test("should show values for each potential value", async ({ page }) => {
        await page.goto("/form?schema=controlSelect");

        await page.waitForSelector(".dtc-form select");

        const options = await page.locator(".dtc-form select option");

        await expect(await options.count()).toEqual(3);
    });
});
