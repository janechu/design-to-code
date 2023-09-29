import { expect, test } from "@playwright/test";

test.describe("ArrayControl", () => {
    test("should not have any list items if there are no array items", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlArray");

        await page.waitForSelector(".dtc-array-control");

        const listItems = await page.locator("li");

        await expect(await listItems.count()).toEqual(0);
    });
    test("should generate a button for adding a list item", async ({ page }) => {
        await page.goto("/form?schema=controlArray");

        await page.waitForSelector(".dtc-array-control");

        const addButton = await page.locator(".dtc-array-control_add-item-button");

        await expect(await addButton.count()).toEqual(1);
    });
    test("should add an array item if the add array item button is clicked", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlArray");

        await page.waitForSelector(".dtc-array-control");

        const addButton = await page.locator(".dtc-array-control_add-item-button");
        await addButton.click();

        const listItems = await page.locator("li");

        await expect(await listItems.count()).toEqual(1);
    });
    test("should remove an array item if the remove array items button has been clicked", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlArray");

        await page.waitForSelector(".dtc-array-control");

        const addButton = await page.locator(".dtc-array-control_add-item-button");
        await addButton.click();

        const removeButton = await page.locator(
            ".dtc-array-control_existing-item-remove-button"
        );

        await removeButton.click();

        const listItems = await page.locator("li");

        await expect(await listItems.count()).toEqual(0);
    });
    test("should navigate to an array item if the array item has been clicked", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlArray");

        await page.waitForSelector(".dtc-array-control");

        const breadcrumbs = page.locator(".dtc-form_breadcrumbs li");

        await expect(await breadcrumbs.count()).toEqual(0);

        const addButton = await page.locator(".dtc-array-control_add-item-button");
        await addButton.click();

        const listItem = await page.locator(".dtc-array-control li a");

        await listItem.click();

        await expect(await breadcrumbs.count()).toEqual(2);
    });
    test("should show default items if default items are available", async ({ page }) => {
        await page.goto("/form?schema=controlArrayDefault");

        await page.waitForSelector(".dtc-array-control");

        const listItems = await page.locator("li");

        await expect(await listItems.count()).toEqual(2);
    });
    test("should show as disabled if the array has been disabled", async ({ page }) => {
        await page.goto("/form?schema=controlArrayDisabled");

        await page.waitForSelector(".dtc-array-control");

        const fieldset = await page.locator("fieldset");

        await expect(await fieldset.getAttribute("disabled")).toEqual("");
    });
    test("should map to an arrays value if the location of the value has been added to the JSON schema", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlArrayDisplayText");

        await page.waitForSelector(".dtc-array-control");

        const listItem = await page.locator("li");

        expect(await listItem.textContent()).toEqual("foo");
    });
});
