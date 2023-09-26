import { expect, test } from "@playwright/test";

test.describe("sectionLink", () => {
    test.describe("snapshot", () => {
        test("base", async ({ page }) => {
            await page.goto("/form?schema=controlSectionLink");
            await expect(page).toHaveScreenshot();
        });
        test("default", async ({ page }) => {
            await page.goto("/form?schema=controlSectionLinkDefault");
            await expect(page).toHaveScreenshot();
        });
        test("disabled", async ({ page }) => {
            await page.goto("/form?schema=controlSectionLinkDisabled");
            await expect(page).toHaveScreenshot();
        });
        test.describe("invalid", () => {
            test("default", async ({ page }) => {
                await page.goto("/form?schema=controlSectionLinkInvalid");
                await expect(page).toHaveScreenshot();
            });
            test("inline", async ({ page }) => {
                await page.goto(
                    "/form?schema=controlSectionLinkInvalid&displayValidationInline=true"
                );
                await expect(page).toHaveScreenshot();
            });
        });
    });
});