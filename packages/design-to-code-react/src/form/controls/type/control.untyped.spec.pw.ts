import { expect, test } from "../../../__tests__/base-fixtures";

test.describe("UntypedControl", () => {
    test("should generate an HTML textarea element", async ({ page }) => {
        await page.goto("/form?schema=controlUntyped");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlUntypedDisabled");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlUntypedDefault");

        await page.waitForSelector(".dtc-untyped-control");

        const untypedControl = await page.locator(".dtc-untyped-control");

        await expect(
            (
                await untypedControl.getAttribute("class")
            ).includes("dtc-untyped-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlUntyped");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("foo");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("foo");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlUntypedDefault");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.inputValue()).toEqual('"foo"');
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlUntypedDefault");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("foo");

        await expect(await textarea.inputValue()).toEqual("foo");
    });
    test("should show value if value is empty string", async ({ page }) => {
        await page.goto("/form?schema=controlUntyped");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("");

        const pre = await page.locator("pre");

        await expect(await pre.textContent()).toEqual("");
    });
});
