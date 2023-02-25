import { expect, Locator, Page } from "@playwright/test";

export async function getMessage(page: Page, positionFromEnd: number): Promise<string> {
    const messageOutput = await page.locator(
        "#messageContainer span:nth-last-child(" + positionFromEnd + ")"
    );
    await expect(messageOutput).not.toBeNull();
    return await messageOutput.textContent();
}

/**
 * Get all messages on the page expected, this will keep running until the
 * expected number of messages is reached
 */
export async function getMessageAll(page: Page, expectedLength: Number): Promise<Locator[]> {
    const currentMessages = await page.locator(
        "#messageContainer span"
    ).all();

    if (expectedLength === currentMessages.length) {
        return currentMessages;
    }

    return getMessageAll(page, expectedLength);
}
