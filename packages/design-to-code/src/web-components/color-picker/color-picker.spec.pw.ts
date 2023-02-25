import { expect, test } from "@playwright/test";

test.describe("Color Picker", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/color-picker");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const color_picker = page.locator("#color_picker");
        await expect(color_picker).toHaveCount(1);
        await expect(page.locator("#control")).toHaveValue("");
    });

    test("should open when clicked", async ({ page }) => {
        await expect(await page.locator(".popup__open")).toHaveCount(0);

        await page.click("#control");

        await expect(await page.locator(".popup__open")).toHaveCount(1);
    });

    test("should open when focused", async ({ page }) => {
        await expect(await page.locator(".popup__open")).toHaveCount(0);

        await page.focus("#control");

        await expect(await page.locator(".popup__open")).toHaveCount(1);
    });

    test("should close when blurred", async ({ page }) => {
        await page.focus("#control");

        await expect(await page.locator(".popup__open")).toHaveCount(1);

        await page.locator("#control").blur();

        await expect(await page.locator(".popup__open")).toHaveCount(0);
    });

    test("setting value should update UI", async ({ page }) => {
        await expect(page.locator("#control")).toHaveValue("");
        await page.click("#control");
        await page.fill("#control", "#AABBCC");
        // Also testing #outputValue ensures that the change event was fired.
        await expect(page.locator("#outputValue")).toHaveValue("#AABBCC");

        await expect(
            page.locator(".popup__open .inputs > div:nth-child(1) input")
        ).toHaveValue("170");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(2) input")
        ).toHaveValue("187");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(3) input")
        ).toHaveValue("204");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(4) input")
        ).toHaveValue("210");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(5) input")
        ).toHaveValue("17");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(6) input")
        ).toHaveValue("80");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(7) input")
        ).toHaveValue("100");
        await page.fill("#control", "rgba(64,128,127,0.5)");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(1) input")
        ).toHaveValue("64");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(2) input")
        ).toHaveValue("128");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(3) input")
        ).toHaveValue("127");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(4) input")
        ).toHaveValue("179");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(5) input")
        ).toHaveValue("50");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(6) input")
        ).toHaveValue("50");
        await expect(
            page.locator(".popup__open .inputs > div:nth-child(7) input")
        ).toHaveValue("50");
    });

    test("setting UI should update value", async ({ page }) => {
        await expect(page.locator("#control")).toHaveValue("");
        await page.click("#control");
        await page.fill(".popup__open .inputs > div:nth-child(1) input", "170");
        await page.fill(".popup__open .inputs > div:nth-child(2) input", "187");
        await page.fill(".popup__open .inputs > div:nth-child(3) input", "204");
        await expect(page.locator("#control")).toHaveValue("#aabbcc");
        await expect(page.locator("#outputValue")).toHaveValue("#aabbcc");
        await page.fill(".popup__open .inputs > div:nth-child(4) input", "179");
        await page.fill(".popup__open .inputs > div:nth-child(5) input", "50");
        await page.fill(".popup__open .inputs > div:nth-child(6) input", "50");
        await page.fill(".popup__open .inputs > div:nth-child(7) input", "50");
        await expect(page.locator("#control")).toHaveValue("rgba(64,128,126,0.5)");
        await expect(page.locator("#outputValue")).toHaveValue("rgba(64,128,126,0.5)");
    });

    test("clicking pickers should change value", async ({ page }) => {
        await expect(page.locator("#control")).toHaveValue("");
        await page.click("#control");
        await page.click(".pickers-saturation");
        await expect(page.locator("#control")).toHaveValue("#801414");
        await expect(page.locator("#outputValue")).toHaveValue("#801414");

        await page.click(".pickers-hue");
        await expect(page.locator("#control")).toHaveValue("#80147f");
        await expect(page.locator("#outputValue")).toHaveValue("#80147f");

        await page.click(".pickers-alpha");
        await expect(page.locator("#control")).toHaveValue("rgba(128,20,127,0.84)");
        await expect(page.locator("#outputValue")).toHaveValue("rgba(128,20,127,0.84)");
    });

    test("dragging sliders should change value", async ({ page }) => {
        await expect(page.locator("#control")).toHaveValue("");
        await page.click("#control");
        await page.click(".pickers-saturation");
        await expect(page.locator("#control")).toHaveValue("#801414");
        await page.mouse.move(142, 232);
        await page.mouse.down();
        await page.mouse.move(200, 232);
        await page.mouse.up();
        await expect(page.locator("#control")).toHaveValue("#590000");
        await expect(page.locator("#outputValue")).toHaveValue("#590000");
        await page.mouse.move(44, 344);
        await page.mouse.down();
        await page.mouse.move(100, 344);
        await page.mouse.up();
        await expect(page.locator("#control")).toHaveValue("#420059");
        await expect(page.locator("#outputValue")).toHaveValue("#420059");
        await page.mouse.move(202, 395);
        await page.mouse.down();
        await page.mouse.move(10, 395);
        await page.mouse.up();
        await expect(page.locator("#control")).toHaveValue("rgba(66,0,89,0.35)");
        await expect(page.locator("#outputValue")).toHaveValue("rgba(66,0,89,0.35)");
    });

    test("should fire a change event if the text field value is changed", async ({
        page,
    }) => {
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").fill("a");
        await page.locator("#control").blur();

        await expect(page.locator("#outputValue")).toHaveValue("a");
    });

    test("should fire a change event if the r (red) text field input value is changed", async ({
        page,
    }) => {
        const rInputIndex = 0;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[rInputIndex]).toHaveValue("255");

        await inputs[rInputIndex].fill("100");
        await inputs[rInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#640000");
    });

    test("should fire a change event if the g (green) text field input value is changed", async ({
        page,
    }) => {
        const gInputIndex = 1;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[gInputIndex]).toHaveValue("0");

        await inputs[gInputIndex].fill("100");
        await inputs[gInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#ff6400");
    });

    test("should fire a change event if the b (blue) text field input value is changed", async ({
        page,
    }) => {
        const bInputIndex = 2;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[bInputIndex]).toHaveValue("0");

        await inputs[bInputIndex].fill("100");
        await inputs[bInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#ff0064");
    });

    test("should fire a change event if the h (hue) text field input value is changed", async ({
        page,
    }) => {
        const hInputIndex = 3;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[hInputIndex]).toHaveValue("0");

        await inputs[hInputIndex].fill("100");
        await inputs[hInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#55ff00");
    });

    test("should fire a change event if the s (saturation) text field input value is changed", async ({
        page,
    }) => {
        const sInputIndex = 4;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[sInputIndex]).toHaveValue("100");

        await inputs[sInputIndex].fill("0");
        await inputs[sInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#ffffff");
    });

    test("should fire a change event if the v (value) text field input value is changed", async ({
        page,
    }) => {
        const vInputIndex = 5;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[vInputIndex]).toHaveValue("100");

        await inputs[vInputIndex].fill("0");
        await inputs[vInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("#000000");
    });

    test("should fire a change event if the a (alpha) text field input value is changed", async ({
        page,
    }) => {
        const aInputIndex = 6;
        await expect(page.locator("#outputValue")).toHaveValue("");

        await page.locator("#control").click();

        const inputs = await page.locator(".inputs input").all();

        await expect(inputs.length).toEqual(7);

        await expect(inputs[aInputIndex]).toHaveValue("100");

        await inputs[aInputIndex].fill("0");
        await inputs[aInputIndex].blur();

        await expect(page.locator("#outputValue")).toHaveValue("rgba(255,0,0,0)");
    });

    test("should fire a change event if the saturation & light picker is clicked", async ({
        page,
    }) => {
        await page.locator("#control").click();

        const satLightPicker = page.locator(".pickers-saturation");

        await expect(page.locator("#outputValue")).toHaveValue("");

        const boundingBox = await satLightPicker.boundingBox();

        await satLightPicker.click({
            position: {
                x: boundingBox.width / 2 - boundingBox.x,
                y: boundingBox.height / 2 - boundingBox.y,
            },
        });

        await expect(page.locator("#outputValue")).toHaveValue("#fc3232");
    });

    test("should fire a change event if the hue picker is clicked", async ({ page }) => {
        await page.locator("#control").click();

        const huePicker = page.locator(".pickers-hue");

        await expect(page.locator("#outputValue")).toHaveValue("");

        const boundingBox = await huePicker.boundingBox();

        await huePicker.click({
            position: {
                x: boundingBox.width / 2 - boundingBox.x,
                y: boundingBox.height / 2,
            },
        });

        await expect(page.locator("#outputValue")).toHaveValue("#cc00ff");
    });

    test("should fire a change event if the alpha picker is clicked", async ({
        page,
    }) => {
        await page.locator("#control").click();

        const alphaPicker = page.locator(".pickers-alpha");

        await expect(page.locator("#outputValue")).toHaveValue("");

        const boundingBox = await alphaPicker.boundingBox();

        await alphaPicker.click({
            position: {
                x: boundingBox.width / 2 - boundingBox.x,
                y: boundingBox.height / 2,
            },
        });

        await expect(page.locator("#outputValue")).toHaveValue("rgba(255,0,0,0.81)");
    });
});
