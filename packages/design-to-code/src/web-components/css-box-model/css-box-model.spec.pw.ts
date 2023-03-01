import { expect, test } from "@playwright/test";

test.describe("CSS Box Model", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/css-box-model");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const css_box_model = await page.locator("#box_model");
        await expect(css_box_model).toHaveCount(1);
        await expect(await page.locator("#margin-top")).toHaveCount(1);
    });

    ["margin", "border-width", "padding"].forEach((property, index) => {
        test.describe(property, () => {
            test("should parse 1 value as separate values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} #control`).fill("10px");
                await page.locator(`#${property} #control`).blur();
                await page.locator(`#${property} + button`).click();

                await expect(propertyTopInput).toHaveValue("10px");
                await expect(propertyLeftInput).toHaveValue("10px");
                await expect(propertyRightInput).toHaveValue("10px");
                await expect(propertyBottomInput).toHaveValue("10px");
            });

            test("should parse 2 values as separate values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} #control`).fill("10px 20px");
                await page.locator(`#${property} #control`).blur();
                await page.locator(`#${property} + button`).click();

                await expect(propertyTopInput).toHaveValue("10px");
                await expect(propertyLeftInput).toHaveValue("20px");
                await expect(propertyRightInput).toHaveValue("20px");
                await expect(propertyBottomInput).toHaveValue("10px");
            });

            test("should parse 3 values as separate values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} #control`).fill("10px 20px 30px");
                await page.locator(`#${property} #control`).blur();
                await page.locator(`#${property} + button`).click();

                await expect(propertyTopInput).toHaveValue("10px");
                await expect(propertyLeftInput).toHaveValue("20px");
                await expect(propertyRightInput).toHaveValue("20px");
                await expect(propertyBottomInput).toHaveValue("30px");
            });

            test("should parse 4 values as separate values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} #control`).fill("10px 20px 30px 40px");
                await page.locator(`#${property} #control`).blur();
                await page.locator(`#${property} + button`).click();

                await expect(propertyTopInput).toHaveValue("10px");
                await expect(propertyLeftInput).toHaveValue("40px");
                await expect(propertyRightInput).toHaveValue("20px");
                await expect(propertyBottomInput).toHaveValue("30px");
            });

            test("should combine values into 1 value", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} + button`).click();

                await propertyTopInput.fill("10px");
                await propertyTopInput.blur();
                await propertyLeftInput.fill("10px");
                await propertyLeftInput.blur();
                await propertyRightInput.fill("10px");
                await propertyRightInput.blur();
                await propertyBottomInput.fill("10px");
                await propertyBottomInput.blur();

                const activeButton = await page.locator(".layout-button__active").all();
                await activeButton[index].click();

                await expect(await page.locator(`#${property} #control`)).toHaveValue(
                    "10px"
                );
            });

            test("should combine values into 2 values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} + button`).click();

                await propertyTopInput.fill("10px");
                await propertyTopInput.blur();
                await propertyLeftInput.fill("20px");
                await propertyLeftInput.blur();
                await propertyRightInput.fill("20px");
                await propertyRightInput.blur();
                await propertyBottomInput.fill("10px");
                await propertyBottomInput.blur();

                const activeButton = await page.locator(".layout-button__active").all();
                await activeButton[index].click();

                await expect(await page.locator(`#${property} #control`)).toHaveValue(
                    "10px 20px"
                );
            });

            test("should combine values into 3 values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} + button`).click();

                await propertyTopInput.fill("10px");
                await propertyTopInput.blur();
                await propertyLeftInput.fill("20px");
                await propertyLeftInput.blur();
                await propertyRightInput.fill("20px");
                await propertyRightInput.blur();
                await propertyBottomInput.fill("30px");
                await propertyBottomInput.blur();

                const activeButton = await page.locator(".layout-button__active").all();
                await activeButton[index].click();

                await expect(await page.locator(`#${property} #control`)).toHaveValue(
                    "10px 20px 30px"
                );
            });

            test("should combine values into 4 values", async ({ page }) => {
                const propertyTopInput = await page.locator(`#${property}-top #control`);
                const propertyLeftInput = await page.locator(
                    `#${property}-left #control`
                );
                const propertyRightInput = await page.locator(
                    `#${property}-right #control`
                );
                const propertyBottomInput = await page.locator(
                    `#${property}-bottom #control`
                );

                await page.locator(`#${property} + button`).click();

                await propertyTopInput.fill("10px");
                await propertyTopInput.blur();
                await propertyLeftInput.fill("40px");
                await propertyLeftInput.blur();
                await propertyRightInput.fill("20px");
                await propertyRightInput.blur();
                await propertyBottomInput.fill("30px");
                await propertyBottomInput.blur();

                const activeButton = await page.locator(".layout-button__active").all();
                await activeButton[index].click();

                await expect(await page.locator(`#${property} #control`)).toHaveValue(
                    "10px 20px 30px 40px"
                );
            });
        });
    });

    test("should produce width and height values", async ({ page }) => {
        const widthInput = await page.locator("#width input");
        const heightInput = await page.locator("#height input");

        await widthInput.fill("10px");
        await heightInput.fill("20px");

        await expect(await page.locator("#outputValue")).toHaveValue(
            "width:10px;height:20px;"
        );
    });
});
