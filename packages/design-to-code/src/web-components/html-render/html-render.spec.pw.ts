import { expect, test } from "@playwright/test";
import { getMessage, getMessageAll } from "./__tests__/helpers.js";

test.describe("HTML Render", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/render");
        const htmlRender = await page.locator("#htmlRender");
        expect(htmlRender).not.toBeNull();
        const content = await htmlRender.locator("span").textContent();
        expect(content).toBe("Dynamic Markup!");
        await getMessageAll(page, 2);
    });

    test("should exist and initialize", async ({ page }) => {
        const htmlRender = await page.locator("#htmlRender");
        expect(htmlRender).not.toBeNull();
        expect(htmlRender.locator(".html-render")).not.toBeNull();
    });
    test("should render markup", async ({ page }) => {
        const htmlRender = await page.locator("#htmlRender");
        expect(htmlRender).not.toBeNull();
        const content = await htmlRender.locator("span").textContent();
        expect(content).toBe("Dynamic Markup!");
    });
    test("should send navigation messages when clicked", async ({ page }) => {
        await page.click("#htmlRender span");
        await getMessageAll(page, 6);

        await expect(await getMessage(page, 2)).toBe("Navigation: span");

        await page.click("#htmlRender div[data-datadictionaryid=root]");
        await getMessageAll(page, 11);

        await expect(await getMessage(page, 2)).toBe("Navigation: root");
    });
    test("should update layers on navigation message", async ({ page }) => {
        await expect(await getMessage(page, 1)).toBe("click root");

        await page.click("#testbutton2");
        await getMessageAll(page, 3);

        await expect(await getMessage(page, 1)).toBe("click span");

        await page.click("#testbutton1");
        await getMessageAll(page, 4);

        await expect(await getMessage(page, 1)).toBe("click root");
    });
    test("should send hover and blur activity to layers", async ({ page }) => {
        await page.mouse.move(55, 60);
        await getMessageAll(page, 3);

        await expect(await getMessage(page, 1)).toBe("hover span");

        await page.mouse.move(55, 80);
        await getMessageAll(page, 4);
        await expect(await getMessage(page, 1)).toBe("blur");
    });
    test("should not send hover activity on selected element", async ({ page }) => {
        await page.click("#testbutton2");
        await getMessageAll(page, 3);

        await page.mouse.move(55, 60);
        await getMessageAll(page, 3);

        await expect(await getMessage(page, 1)).toBe("click span");

        await page.mouse.move(55, 80);
        await getMessageAll(page, 5);

        await expect(await getMessage(page, 1)).toBe("hover root");
    });
    test("should click activity to layers", async ({ page }) => {
        await page.mouse.click(55, 60);
        await getMessageAll(page, 6);

        await expect(await getMessage(page, 1)).toBe("click span");

        await page.mouse.click(55, 80);
        await getMessageAll(page, 11);

        await expect(await getMessage(page, 1)).toBe("click root");
    });
    test("should send navigation on tab", async ({ page }) => {
        await page.keyboard.press("Tab");
        await getMessageAll(page, 2);

        await page.keyboard.press("Tab");
        await getMessageAll(page, 2);

        await page.keyboard.press("Tab");
        await getMessageAll(page, 5);

        await expect(await getMessage(page, 1)).toBe("click span");
        await expect(await getMessage(page, 2)).toBe("Navigation: span");

        await page.keyboard.press("Shift+Tab");
        await getMessageAll(page, 8);

        await expect(await getMessage(page, 1)).toBe("click root");
        await expect(await getMessage(page, 2)).toBe("Navigation: root");
    });
});
