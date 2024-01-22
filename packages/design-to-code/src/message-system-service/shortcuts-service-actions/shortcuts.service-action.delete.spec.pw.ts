import { expect, test } from "../../__test__/base-fixtures.js";
import { Register } from "../../message-system/message-system.props.js";
import {
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
} from "../../message-system/message-system.utilities.props.js";
import { MessageSystemType } from "../../message-system/types.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe("ShortcutsActionDelete", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system");
    });
    test("should return an instance of a ShortcutAction", async ({ page }) => {
        const instanceOfShortcutAction = await page.evaluate(() => {
            return (
                (window as any).dtc.ShortcutsActionDelete(
                    new (window as any).dtc.MessageSystem({ webWorker: "" })
                ) instanceof (window as any).dtc.ShortcutsAction
            );
        });
        expect(instanceOfShortcutAction).toEqual(true);
    });
    test("should call an event to delete the active dictionary ID item when the keyboard event is used", async ({
        page,
    }) => {
        const callbacks = await page.evaluate(() => {
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
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.navigation,
                        action: MessageSystemNavigationTypeAction.update,
                        activeDictionaryId: "text",
                    },
                } as any);
            });

            new (window as any).dtc.Shortcuts({
                messageSystem: messageSystem,
                target: inputElement,
                actions: [(window as any).dtc.ShortcutsActionDelete(messageSystem)],
            });

            const callback1 = callbackCount;

            const keyboardEvent = new KeyboardEvent("keydown", {
                key: "Delete",
            });
            inputElement.dispatchEvent(keyboardEvent);

            const callback2 = callbackCount;

            return [callback1, callback2, callbackArgs.type, callbackArgs.action];
        });

        expect(callbacks[0]).toEqual(0);
        expect(callbacks[1]).toEqual(1);
        expect(callbacks[2]).toEqual(MessageSystemType.data);
        expect(callbacks[3]).toEqual(MessageSystemDataTypeAction.removeLinkedData);
    });
});
