import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("DisplayControl", () => {
    test("should generate an HTML input element", async ({ page }) => {
        await page.goto("/form?schema=controlDisplay");

        await page.waitForSelector(".dtc-display-control");

        const display = await page.locator(".dtc-display-control");

        await expect(await display.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlDisplayDisabled");

        await page.waitForSelector(".dtc-display-control");

        const display = await page.locator(".dtc-display-control");

        await expect(await display.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDisplayDefault");

        await page.waitForSelector(".dtc-display-control");

        const display = await page.locator(".dtc-display-control");

        await expect(
            (await display.getAttribute("class")).includes("dtc-display-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDisplayDefault");

        await page.waitForSelector(
            ".dtc-standard-control-template_const-value-indicator"
        );

        const setConstButton = await page.locator(
            ".dtc-standard-control-template_const-value-indicator"
        );
        await setConstButton.click();

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("foo");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlDisplayDefault");

        await page.waitForSelector(".dtc-display-control");

        const display = await page.locator(".dtc-display-control");

        await expect(await display.inputValue()).toEqual("foo");
    });
});
