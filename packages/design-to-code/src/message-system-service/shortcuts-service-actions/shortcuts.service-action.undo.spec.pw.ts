import { expect, test } from "@playwright/test";
import { Register } from "../../message-system/message-system.props.js";
import {
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemNavigationTypeAction,
} from "../../message-system/message-system.utilities.props.js";
import { MessageSystemType } from "../../message-system/types.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe.only("ShortcutsActionUndo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system");
    });
    test("should return an instance of a ShortcutAction", async ({ page }) => {
        const instanceOfShortcutsAction = await page.evaluate(() => {
            return (
                (window as any).dtc.ShortcutsActionUndo(
                    new (window as any).dtc.MessageSystem({ webWorker: "" })
                ) instanceof (window as any).dtc.ShortcutsAction
            );
        });
        expect(instanceOfShortcutsAction).toEqual(true);
    });
    test("should should return the result of the previous message to be sent", async ({
        page,
    }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeNavigation, messageSystemNavigationTypeActionUpdate]: [
                string,
                string
            ]) => {
                const inputElement = document.createElement("input");
                let callbackArgs = null;
                let callbackCount = 0;
                const postMessageCallback: any = (config: any) => {
                    callbackArgs = config;
                    callbackCount++;
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: (window as any).dtc.dataDictionary,
                    schemaDictionary: (window as any).dtc.schemaDictionary,
                });
                messageSystem.postMessage = postMessageCallback;

                const shortcutsService = new (window as any).dtc.Shortcuts({
                    messageSystem: messageSystem,
                    target: inputElement,
                    actions: [(window as any).dtc.ShortcutsActionUndo(messageSystem)],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeNavigation,
                            action: messageSystemNavigationTypeActionUpdate,
                            activeDictionaryId: "text",
                        },
                    } as any);
                });

                const callback1 = callbackCount;

                shortcutsService["dataDictionary"] = (window as any).dtc.dataDictionary;
                shortcutsService["activeDictionaryId"] = "text";

                const keyboardEvent = new KeyboardEvent("keydown", {
                    ctrlKey: true,
                    key: "z",
                });
                inputElement.dispatchEvent(keyboardEvent);

                return [callback1, callbackCount];
            },
            [MessageSystemType.navigation, MessageSystemNavigationTypeAction.update]
        );

        expect(callbacks[0]).toEqual(0);
        expect(callbacks[1]).toEqual(1);
    });
});
