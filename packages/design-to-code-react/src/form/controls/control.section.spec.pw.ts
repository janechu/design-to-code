import { expect, test } from "@playwright/test";

test.describe("SectionControl", () => {
    test("should generate an HTML fieldset element", async ({ page }) => {
        await page.goto("/form?schema=controlSection");

        const section = page.locator(".dtc-form fieldset.dtc-section-control");
        await section.waitFor({ state: "attached" });

        await expect(await section.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlSectionDisabled");

        const section = page.locator("fieldset.dtc-section-control__disabled");
        await section.waitFor({ state: "attached" });

        await expect(await section.count()).toEqual(1);
    });
    test("should have a select when there is a oneOf array", async ({ page }) => {
        await page.goto("/form?schema=controlSectionOneOf");

        const select = page.locator(".dtc-section-control select");
        await select.waitFor();

        await expect(await select.count()).toEqual(1);
    });
});
