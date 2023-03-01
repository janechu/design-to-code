import { expect, test } from "@playwright/test";
import { getMessageAll } from "../html-render/__tests__/helpers.js";

test.describe("HTML Render Layer Navigation", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/render");
        const htmlRender = page.locator("#htmlRender");
        await expect(htmlRender).toHaveCount(1);
        const content = await htmlRender.locator("span").textContent();
        expect(content).toBe("Dynamic Markup!");
        await getMessageAll(page, 2);
    });

    test("should exist and initialize", async ({ page }) => {
        const layer = await page.locator(
            "dtc-html-render-layer-navigation .navigation-select"
        );
        expect(layer).not.toBeNull();
        await expect(layer).toHaveClass(
            "navigation-select navigation-select__insetX navigation-select__active"
        );
    });

    test("should show hover on hover target", async ({ page }) => {
        let layer = await page.locator(
            "dtc-html-render-layer-navigation .navigation-hover"
        );
        expect(layer).not.toBeNull();
        await expect(layer).not.toHaveClass("navigation-hover navigation-hover__active");

        await page.mouse.move(55, 60);
        await getMessageAll(page, 3);

        layer = await page.locator("dtc-html-render-layer-navigation .navigation-hover");
        await expect(layer).toHaveClass("navigation-hover navigation-hover__active");
    });

    test("should not show hover on selected target", async ({ page }) => {
        let layer = await page.locator(
            "dtc-html-render-layer-navigation .navigation-hover"
        );
        expect(layer).not.toBeNull();
        await expect(layer).not.toHaveClass("navigation-hover navigation-hover__active");

        await page.mouse.move(55, 80);
        await getMessageAll(page, 2);

        layer = await page.locator("dtc-html-render-layer-navigation .navigation-hover");
        await expect(layer).not.toHaveClass("navigation-hover navigation-hover__active");
    });

    test("should select click target", async ({ page }) => {
        let layer = await page.locator(
            "dtc-html-render-layer-navigation .navigation-select"
        );
        expect(layer).not.toBeNull();
        await expect(layer).toHaveCSS("top", /(21|21.5)px/);
        await expect(layer.locator(".select-pill")).toHaveText("root_div");

        await page.click("#testbutton2");
        await getMessageAll(page, 3);

        layer = await page.locator("dtc-html-render-layer-navigation .navigation-select");
        expect(layer).not.toBeNull();
        await expect(layer).toHaveCSS("top", /(52|52.5)px/);
        await expect(layer.locator(".select-pill")).toHaveText("span");
    });

    test("should inset selected area only when adjacent to edge of window", async ({
        page,
    }) => {
        let layer = await page.locator(
            "dtc-html-render-layer-navigation .navigation-select"
        );
        expect(layer).not.toBeNull();
        await expect(layer).toHaveClass(
            "navigation-select navigation-select__insetX navigation-select__active"
        );

        await page.click("#testbutton2");
        await getMessageAll(page, 3);

        layer = await page.locator("dtc-html-render-layer-navigation .navigation-select");
        expect(layer).not.toBeNull();
        await expect(layer).toHaveClass("navigation-select navigation-select__active");
    });
});
