import { expect, test } from "@playwright/test";
import { getMessage, getMessageAll } from "../html-render/__tests__/helpers.js";

test.describe.only("HTML Render Layer Inline Edit", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/render");
        await page.reload();
        const htmlRender = await page.locator("#htmlRender");
        await expect(htmlRender).not.toBeNull();
        const content = await htmlRender.locator("span").textContent();
        expect(content).toBe("Dynamic Markup!");
        await getMessageAll(page, 2);
    });

    test("should exist and initialize", async ({ page }) => {
        const editor = await page.locator(
            "dtc-html-render-layer-inline-edit .edit-textarea"
        );
        expect(editor).not.toBeNull();
        await expect(editor).toHaveCSS("display", "none");
    });

    test("should show on double click", async ({ page }) => {
        await page.mouse.dblclick(55, 60);
        await getMessageAll(page, 12);

        const editor = await page.locator(
            "dtc-html-render-layer-inline-edit .edit-textarea__active"
        );
        expect(editor).not.toBeNull();
        await expect(editor).toHaveCSS("display", "block");
    });

    test("should take focus and navigate on double click", async ({ page }) => {
        await page.mouse.dblclick(55, 60);
        await getMessageAll(page, 12);

        const messageOutput = await page.locator("#messageContainer");
        await expect(messageOutput).toHaveText(/takeFocus/);
        await expect(messageOutput).toHaveText(/dblclick text/);
        await expect(messageOutput).toHaveText(/Navigation: text/);
    });

    // This test is flakey on GitHub workflows
    test.skip("should release and commit on enter or loss of focus", async ({ page }) => {
        await page.mouse.dblclick(55, 60);
        await getMessageAll(page, 12);

        await page.keyboard.press("Enter");
        await getMessageAll(page, 17);

        await expect(await getMessage(page, 5)).toBe("release");
        await expect(await getMessage(page, 4)).toBe(
            "Inline Edit: text = Dynamic Markup!"
        );
    });

    test("should update text on commit", async ({ page }) => {
        await page.mouse.dblclick(55, 60);
        await getMessageAll(page, 12);

        await page.keyboard.type("foo");
        await getMessageAll(page, 15);

        await page.keyboard.press("Enter");
        await getMessageAll(page, 19);

        await expect(await getMessage(page, 3)).toBe(
            "Inline Edit: text = Dynamic Markup!foo"
        );
        const htmlRender = await page.locator("#htmlRender");
        await expect(htmlRender).not.toBeNull();
        const content = await htmlRender.locator("span").textContent();
        expect(content).toBe("Dynamic Markup!foo");
    });
});
