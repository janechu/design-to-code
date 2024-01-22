import { expect, test } from "../../../__tests__/base-fixtures";

test.describe("SectionLinkControl", () => {
    test("should generate an HTML anchor element", async ({ page }) => {
        await page.goto("/form?schema=controlSectionLink");

        await page.waitForSelector(".dtc-form a.dtc-section-link-control");

        const link = await page.locator(".dtc-form a.dtc-section-link-control");

        await expect(await link.count()).toEqual(1);
    });
    test("should be disabled when disabled props is passed", async ({ page }) => {
        await page.goto("/form?schema=controlSectionLinkDisabled");

        await page.waitForSelector(".dtc-form .dtc-section-link-control");

        const sectionLink = await page.locator(".dtc-section-link-control__disabled");

        await expect(await sectionLink.count()).toEqual(1);
    });
    test("should have the default class when default prop is passed", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlSectionLinkDefault");

        await page.waitForSelector(".dtc-form .dtc-section-link-control");

        const sectionLink = await page.locator(".dtc-section-link-control__default");

        await expect(await sectionLink.count()).toEqual(1);
    });
    test("should navigate to the section if the section link is clicked", async ({
        page,
    }) => {
        await page.goto("/form?schema=controlSectionLink");

        await page.waitForSelector(".dtc-form .dtc-section-link-control");

        const sectionLink = await page.locator(".dtc-form .dtc-section-link-control");

        await sectionLink.click();

        const breadcrumbs = await page.locator(".dtc-form_breadcrumbs li");

        await expect(await breadcrumbs.count()).toEqual(2);
    });
});
