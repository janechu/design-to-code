import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("ButtonControl", () => {
    test("should generate an HTML button element", async ({ page }) => {
        await page.goto("/form?schema=controlButton");

        await page.waitForSelector(".dtc-button-control");

        const button = await page.locator(".dtc-button-control");

        await expect(await button.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlButtonDisabled");

        await page.waitForSelector(".dtc-button-control");

        const button = await page.locator(".dtc-button-control");

        await expect(await button.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlButtonDefault");

        await page.waitForSelector(".dtc-button-control");

        const button = await page.locator(".dtc-button-control");

        await expect(
            (await button.getAttribute("class")).includes("dtc-button-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlButton");

        await page.waitForSelector(".dtc-button-control");

        const button = await page.locator(".dtc-button-control");

        await button.click();

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual(null);
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlButtonDefault");

        await page.waitForSelector(".dtc-button-control");

        const button = await page.locator(".dtc-button-control");

        await expect(await button.innerText()).toEqual("Set to null");
    });
});
