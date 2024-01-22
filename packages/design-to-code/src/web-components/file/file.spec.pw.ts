import { expect, test } from "../../__test__/base-fixtures";
import { File as DTCFile } from "./file.js";

test.describe("File", () => {
    test.beforeEach(async ({ page }) => {
        // Playwright is configured to use http://localhost:7001 as the base URL for all tests
        // so you can use a relative URL to navigate to a different page.
        await page.goto("/file");
        await page.reload();
    });

    test("should exist and initialize", async ({ page }) => {
        const file = await page.locator("dtc-file");
        await expect(file).toHaveCount(1);
        await expect(await page.locator("dtc-file button")).toHaveCount(1);
    });

    test("should trigger change event", async ({ page }) => {
        await page.evaluate(() => {
            const element = document.getElementsByTagName("dtc-file")[0];

            // This is a base 64 encoding of a 2x1 pixel jpeg image.
            const imageContent: string =
                "/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD85f2t/wDk6z4nf9jZqv8A6WS0UUV7B8rLdn//2Q==";

            // This fake file event allows us to bypass using the real <input type="file"> element by faking the FileList that would have been returned
            // by the system file picker.
            const fakeFileEvent = {
                composedPath: () => {
                    // convert the base64 image encoding into a UTF8 character string
                    let n = imageContent.length;
                    const u8 = new Uint8Array(n);
                    const bstr = atob(imageContent);
                    while (n--) {
                        u8[n] = bstr.charCodeAt(n);
                    }
                    const fakeFile = new File([u8], "fakefile.jpg", {
                        type: "image/jpeg",
                    });
                    return [
                        {
                            files: {
                                0: fakeFile,
                                length: 1,
                                item: (index: number) => fakeFile,
                            },
                        },
                    ];
                },
            };

            (element as DTCFile).handleChange(fakeFileEvent as unknown as Event);
        });

        const outputValue = await page.locator("#outputValue").inputValue();

        await expect(outputValue.startsWith("blob:http://localhost:8080")).toBe(true);
    });
});
