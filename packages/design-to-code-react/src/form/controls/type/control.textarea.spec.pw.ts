import { expect, test } from "../../../__tests__/base-fixtures.js";

test.describe("TextareaControl", () => {
    test("should generate an HTML textarea element", async ({ page }) => {
        await page.goto("/form?schema=controlTextarea.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlTextareaDisabled.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTextareaDefault.html");

        await page.waitForSelector("textarea");

        await page.evaluate(async () => {
            const textarea = document.getElementsByTagName("textarea");

            textarea.item(0).innerHTML = void 0;
        });

        const textarea = await page.locator("textarea");

        await expect(
            (
                await textarea.getAttribute("class")
            ).includes("dtc-textarea-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTextarea.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("foo");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("foo");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlTextareaDefault.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await expect(await textarea.inputValue()).toEqual("foobar");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlTextareaDefault.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("foo");

        await expect(await textarea.inputValue()).toEqual("foo");
    });
    test("should show value if value is empty string", async ({ page }) => {
        await page.goto("/form?schema=controlTextarea.html");

        await page.waitForSelector("textarea");

        const textarea = await page.locator("textarea");

        await textarea.fill("");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("");
    });
});
