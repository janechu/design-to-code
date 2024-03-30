import React from "react";
import { expect, test } from "../__tests__/base-fixtures.js";
import { DataType, mapDataDictionary, pluginIdKeyword } from "design-to-code";
import { ComponentDictionary, reactMapper, reactResolver } from "./mapping";

test.describe.only("reactMapper", () => {
    test("should map data to a React component as props", async ({ page }) => {
        await page.goto("/utilities");

        await page.evaluate(async () => {
            const event = new CustomEvent("test", { detail: "mapDataAsProps" });
            await window.dispatchEvent(event);
        });

        const element = await page.locator("#foo");

        await expect(await element.count()).toEqual(1);
        await expect(await element.getAttribute("data-text")).toEqual("Hello");
        await expect(await element.getAttribute("data-number")).toEqual("42");
    });
    test("should map data to a React component as children", async ({ page }) => {
        await page.goto("/utilities");

        await page.evaluate(async () => {
            const event = new CustomEvent("test", { detail: "mapDataAsChildren" });
            await window.dispatchEvent(event);
        });

        const element = await page.locator("#foo");

        await expect(await element.count()).toEqual(1);
        await expect(await element.textContent()).toEqual("FooHello world");
    });
    test("should map data to nested React components", async ({ page }) => {
        await page.goto("/utilities");

        await page.evaluate(async () => {
            const event = new CustomEvent("test", { detail: "mapDataNested" });
            await window.dispatchEvent(event);
        });

        const elementFoo = await page.locator("#foo");
        const elementBar = await page.locator("#bar");

        await expect(await elementFoo.count()).toEqual(1);
        await expect(await elementBar.count()).toEqual(1);
        await expect(await elementBar.textContent()).toEqual("Hello world");
    });
    test("should map data with a plugin", async ({ page }) => {
        await page.goto("/utilities");

        await page.evaluate(async () => {
            const event = new CustomEvent("test", { detail: "mapDataAsPlugin" });
            await window.dispatchEvent(event);
        });

        const element = await page.locator("#foo");

        await expect(await element.count()).toEqual(1);
        await expect(await element.getAttribute("data-text")).toEqual("Hello world, !");
        await expect(await element.getAttribute("data-number")).toEqual("42");
    });
    test("should resolve data with a plugin", async ({ page }) => {
        await page.goto("/utilities");

        await page.evaluate(async () => {
            const event = new CustomEvent("test", { detail: "resolveDataAsPlugin" });
            await window.dispatchEvent(event);
        });

        const element = await page.locator("#foo");

        await expect(await element.count()).toEqual(1);
        await expect(await element.textContent()).toEqual("Hello world");
    });
});
