import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("DateControl", () => {
    test("should generate an HTML input element with type 'date'", async ({ page }) => {
        await page.goto("/form?schema=controlDate.html");

        await page.waitForSelector("input[type='date']");

        const date = await page.locator("input[type='date']");

        await expect(await date.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlDateDisabled.html");

        await page.waitForSelector("input[type='date']");

        const date = await page.locator("input[type='date']");

        await expect(await date.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateDefault.html");

        await page.waitForSelector("input[type='date']");

        const dateContainer = await page.locator(".dtc-date-control");

        await expect(
            (
                await dateContainer.getAttribute("class")
            ).includes("dtc-date-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDate.html");

        await page.waitForSelector("input[type='date']");

        const date = await page.locator("input[type='date']");

        await date.fill("1985-01-01");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("1985-01-01");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDateDefault.html");

        await page.waitForSelector("input[type='date']");

        const date = await page.locator("input[type='date']");

        await expect(await date.inputValue()).toEqual("1985-01-01");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlDateDefault.html");

        await page.waitForSelector("input[type='date']");

        const date = await page.locator("input[type='date']");

        await date.fill("2003-01-01");

        await expect(await date.inputValue()).toEqual("2003-01-01");
    });
});
