import { expect, test } from "@playwright/test";

test.describe("EmailControl", () => {
    test("should generate an HTML input element with type 'email'", async ({ page }) => {
        await page.goto("/form?schema=controlEmail");

        await page.waitForSelector("input[type='email']");

        const email = await page.locator("input[type='email']");

        await expect(await email.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlEmailDisabled");

        await page.waitForSelector("input[type='email']");

        const textarea = await page.locator("input[type='email']");

        await expect(await textarea.getAttribute("disabled")).toEqual("");
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlEmailDefault");

        await page.waitForSelector("input[type='email']");

        const emailContainer = await page.locator(".dtc-email-control");

        await expect(
            (
                await emailContainer.getAttribute("class")
            ).includes("dtc-email-control__default")
        ).toBe(true);
    });
    test("should send a message to the Message System when the input is changed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlEmail");

        await page.waitForSelector("input[type='email']");

        const email = await page.locator("input[type='email']");

        await email.fill("foo@bar.com");

        const pre = await page.locator("pre");

        await expect(JSON.parse(await pre.textContent())).toEqual("foo@bar.com");
    });
    test("should show default values if they exist and no data is available", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlEmailDefault");

        await page.waitForSelector("input[type='email']");

        const email = await page.locator("input[type='email']");

        await expect(await email.inputValue()).toEqual("foo@bar.com");
    });
    test("should not show default values if data exists", async ({ page }) => {
        await page.goto("/form?schema=controlEmailDefault");

        await page.waitForSelector("input[type='email']");

        const email = await page.locator("input[type='email']");

        await email.fill("bat@baz.com");

        await expect(await email.inputValue()).toEqual("bat@baz.com");
    });
});
