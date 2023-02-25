import { expect, test } from "@playwright/test";

test.describe.only("CSSLayout", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/css-layout");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const css_layout = await page.locator("dtc-css-layout");
        await expect(css_layout).toHaveCount(1);
        await expect(await page.locator("#enable-flexbox")).toHaveCount(1);
    });

    test("should show the flexbox toggle if it has not been pressed", async ({
        page,
    }) => {
        await expect(await page.locator(".flexbox-region__active").all()).toHaveLength(0);
    });

    test("should not show the flexbox toggle if it has been pressed", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        await expect(await page.locator(".flexbox-region__active").all()).toHaveLength(1);
    });

    test("should add display:flex when the flexbox toggle is triggered", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        await expect(await page.locator("#outputValue")).toHaveValue("display: flex;");
    });

    test("should emit an updated flex-direction value when the flex-direction value is updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        const flexDirectionInputs = await page
            .locator("input[name='flex-direction']")
            .all();
        await flexDirectionInputs[0].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-direction: row;"
        );

        await flexDirectionInputs[1].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-direction: row-reverse;"
        );

        await flexDirectionInputs[2].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-direction: column;"
        );

        await flexDirectionInputs[3].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-direction: column-reverse;"
        );
    });

    test("should emit an updated justify-content value when the justify-content value is updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        const justifyContentInputs = await page
            .locator("input[name='justify-content']")
            .all();
        await justifyContentInputs[0].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: flex-start;"
        );

        await justifyContentInputs[1].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: flex-end;"
        );

        await justifyContentInputs[2].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: center;"
        );

        await justifyContentInputs[3].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: stretch;"
        );

        await justifyContentInputs[4].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: space-between;"
        );

        await justifyContentInputs[5].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: space-around;"
        );

        await justifyContentInputs[6].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; justify-content: space-evenly;"
        );
    });

    test("should emit an updated align-content value when the align-content value is updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        const alignContentInputs = await page
            .locator("input[name='align-content']")
            .all();
        await alignContentInputs[0].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: flex-start;"
        );

        await alignContentInputs[1].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: flex-end;"
        );

        await alignContentInputs[2].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: center;"
        );

        await alignContentInputs[3].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: stretch;"
        );

        await alignContentInputs[4].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: space-between;"
        );

        await alignContentInputs[5].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: space-around;"
        );

        await alignContentInputs[6].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-content: space-evenly;"
        );
    });

    test("should emit an updated align-items value when the align-items value is updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        const alignItemsInputs = await page.locator("input[name='align-items']").all();
        await alignItemsInputs[0].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-items: flex-start;"
        );

        await alignItemsInputs[1].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-items: flex-end;"
        );

        await alignItemsInputs[2].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-items: center;"
        );

        await alignItemsInputs[3].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; align-items: stretch;"
        );
    });

    test("should emit an updated row gap value when the row gap value has been updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        await page.locator("input[name='row-gap']").fill("5");

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; row-gap: 5px;"
        );
    });

    test("should emit an updated column gap value when the column gap value has been updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        await page.locator("input[name='column-gap']").fill("5");

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; column-gap: 5px;"
        );
    });

    test("should emit an updated flex-wrap value when the flex-wrap value has been updated", async ({
        page,
    }) => {
        const toggle = await page.locator(".control-region.dtc-toggle-control");
        await toggle.click();

        const flexWrapInputs = await page.locator("input[name='flex-wrap']").all();
        await flexWrapInputs[0].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-wrap: wrap;"
        );

        await flexWrapInputs[1].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-wrap: wrap-reverse;"
        );

        await flexWrapInputs[2].click();

        await expect(await page.locator("#outputValue")).toHaveValue(
            "display: flex; flex-wrap: nowrap;"
        );
    });
});
