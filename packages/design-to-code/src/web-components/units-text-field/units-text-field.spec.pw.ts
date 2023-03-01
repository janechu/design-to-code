import { expect, test } from "@playwright/test";
import { DTCUnitsTextField } from "./units-text-field.define.js";

test.describe("Units text-field", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/units-text-field");
    });

    test("should exist and initialize", async ({ page }) => {
        await expect(await page.locator("dtc-units-text-field")).toHaveCount(1);

        await expect(await page.locator("dtc-units-text-field #control")).toHaveCount(1);
    });

    test("should do nothing without a numeric value", async ({ page }) => {
        await page.locator("dtc-units-text-field #control").fill("a");

        await expect(await page.locator("dtc-units-text-field #control")).toHaveValue(
            "a"
        );
    });

    test("should modify a single value", async ({ page }) => {
        const control = page.locator("dtc-units-text-field #control");
        await control.fill("10px");

        // up arrow at beginning
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("11px");

        // shift up at beginning
        await control.dispatchEvent("keydown", {
            key: "ArrowUp",
            shiftKey: true,
        });
        await expect(control).toHaveValue("21px");

        // down shift at beginning
        await control.dispatchEvent("keydown", {
            key: "ArrowDown",
            shiftKey: true,
        });
        await expect(control).toHaveValue("11px");

        // shift down at beginning
        await control.dispatchEvent("keydown", {
            key: "ArrowDown",
        });
        await expect(control).toHaveValue("10px");
    });

    test("should handle negatives and decimals", async ({ page }) => {
        const control = page.locator("dtc-units-text-field #control");
        await control.fill("10px");

        await control.dispatchEvent("keydown", {
            key: "ArrowDown",
            shiftKey: true,
        });
        await expect(control).toHaveValue("0px");
        await control.dispatchEvent("keydown", {
            key: "ArrowDown",
            shiftKey: true,
        });
        await expect(control).toHaveValue("-10px");

        await control.dispatchEvent("keydown", {
            key: "ArrowUp",
            shiftKey: true,
        });
        await expect(control).toHaveValue("0px");
        await control.dispatchEvent("keydown", {
            key: "ArrowUp",
            shiftKey: true,
        });
        await expect(control).toHaveValue("10px");
    });

    test("should handle decimals", async ({ page }) => {
        const control = page.locator("dtc-units-text-field #control");
        await control.fill("1.5em");
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("2.5em");
    });

    test("should handle multple values", async ({ page }) => {
        const control = page.locator("dtc-units-text-field #control");
        await control.fill("10px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(0, 0);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("11px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(4, 4);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(5, 5);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 21px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(11, 11);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 21px 31px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(14, 14);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 21px 32px");
    });

    test("should handle highlighted values", async ({ page }) => {
        const control = page.locator("dtc-units-text-field #control");
        await control.fill("10px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(0, 2);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("11px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(2, 4);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 20px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(5, 9);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 21px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(8, 14);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 22px 30px");

        await page.evaluate(async () => {
            const element = document.getElementsByTagName(
                "dtc-units-text-field"
            )[0] as DTCUnitsTextField;

            element.control.setSelectionRange(10, 14);
        });
        await control.dispatchEvent("keydown", { key: "ArrowUp" });
        await expect(control).toHaveValue("12px 22px 31px");
    });
});
