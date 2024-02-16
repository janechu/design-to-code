import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("TimeControl", () => {
    test("should generate an HTML input element with type 'time'", async ({ page }) => {
        await page.goto("/form?schema=controlTime");

        await page.waitForSelector("input[type='time']");

        const time = await page.locator("input[type='time']");

        await expect(await time.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlTimeDisabled");

        await page.waitForSelector("input[type='time']");

        const textarea = await page.locator("input[type='time']");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTimeDefault");

        await page.waitForSelector("input[type='time']");

        const timeContainer = await page.locator(".dtc-time-control");

        await expect(
            (
                await timeContainer.getAttribute("class")
            ).includes("dtc-time-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTime");

        await page.waitForSelector("input[type='time']");

        const time = await page.locator("input[type='time']");

        await time.fill("00:00");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("00:00:00");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTimeDefault");

        await page.waitForSelector("input[type='time']");

        const time = await page.locator("input[type='time']");

        await expect(await time.inputValue()).toEqual("00:00:00");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlTimeDefault");

        await page.waitForSelector("input[type='time']");

        const time = await page.locator("input[type='time']");

        await time.fill("00:00");

        await expect(await time.inputValue()).toEqual("00:00:00");
    });
});
