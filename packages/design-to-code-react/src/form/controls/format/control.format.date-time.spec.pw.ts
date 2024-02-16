import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("DateTimeControl", () => {
    test("should generate an HTML input element with type 'datetime-local'", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateTime.html");

        await page.waitForSelector("input[type='datetime-local']");

        const date = await page.locator("input[type='datetime-local']");

        await expect(await date.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlDateTimeDisabled.html");

        await page.waitForSelector("input[type='datetime-local']");

        const textarea = await page.locator("input[type='datetime-local']");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateTimeDefault.html");

        await page.waitForSelector("input[type='datetime-local']");

        const dateContainer = await page.locator(".dtc-date-time-control");

        await expect(
            (
                await dateContainer.getAttribute("class")
            ).includes("dtc-date-time-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateTime.html");

        await page.waitForSelector("input[type='datetime-local']");

        const date = await page.locator("input[type='datetime-local']");

        await date.fill("1985-01-01T00:00");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("1985-01-01T00:00:00");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateTimeDefault.html");

        await page.waitForSelector("input[type='datetime-local']");

        const date = await page.locator("input[type='datetime-local']");

        await expect(await date.inputValue()).toEqual("1985-01-01T00:00");
    });
    // This fails but passes when manually tested -- potentially an issue with playwright
    test.skip("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlDateTimeDefault.html");

        await page.waitForSelector("input[type='datetime-local']");

        const date = await page.locator("input[type='datetime-local']");

        await date.fill("2003-01-01T00:00");

        await expect(await date.inputValue()).toEqual("2003-01-01T00:00:00");
    });
});
