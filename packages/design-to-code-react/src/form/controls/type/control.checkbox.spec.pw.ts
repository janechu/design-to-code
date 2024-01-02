import { expect, test } from "@playwright/test";

test.describe("CheckboxControl", () => {
    test("should generate an HTML input element with type 'checkbox'", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlCheckbox");

        await page.waitForSelector("input");

        const checkbox = await page.locator("input");

        await expect(await checkbox.count()).toEqual(1);

        await expect(await checkbox.getAttribute("type")).toEqual("checkbox");
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlCheckboxDisabled");

        await page.waitForSelector("input");

        const textarea = await page.locator("input");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlCheckboxDefault");

        await page.waitForSelector("input");

        const checkboxContainer = await page.locator(".dtc-checkbox-control");

        await expect(
            (
                await checkboxContainer.getAttribute("class")
            ).includes("dtc-checkbox-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlCheckbox");

        await page.waitForSelector("input");

        const checkbox = await page.locator("input");

        await checkbox.click();

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual(true);
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlCheckboxDefault");

        await page.waitForSelector("input");

        const checkbox = await page.locator("input");

        await expect(await checkbox.inputValue()).toEqual("true");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlCheckboxDefault");

        await page.waitForSelector("input");

        const checkbox = await page.locator("input");

        await checkbox.click();

        await expect(await checkbox.inputValue()).toEqual("false");
    });
});
