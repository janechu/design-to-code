import { expect, test } from "@playwright/test";
import { MessageSystemType } from "../message-system/index.js";
import { MonacoAdapterAction } from "./monaco-adapter.service-action.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe.only("MonacoAdapterAction", () => {
    test("should not throw", () => {
        expect(() => {
            new MonacoAdapterAction({
                action: () => {},
                id: "foo",
            });
        }).not.toThrow();
    });
    test("should add config items to an instance of the action", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const callback3: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action: () => {},
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction["getMonacoModelValue"]).toEqual(callback1);
        expect(monacoAdapterAction["updateMonacoModelValue"]).toEqual(callback2);
        expect(monacoAdapterAction["messageSystemType"]).toEqual(
            MessageSystemType.custom
        );
    });
    test("should invoke an action with config items", () => {
        const actions = [];
        const callback1: any = () => {};
        const callback2: any = () => {};
        const callback3: any = () => {};
        const action: any = e => {
            actions.push(e);
        };
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });

        expect(actions).toHaveLength(0);

        monacoAdapterAction.invoke();

        expect(actions).toHaveLength(1);
        expect(actions[0]).toMatchObject({
            id: "foo",
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });
    });
    test("should return the MessageSystemType when using the getMessageSystemType", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const callback3: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.getMessageSystemType()).toEqual(
            MessageSystemType.custom
        );
    });
    test("should return true if the MessageSystemType matches", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const callback3: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.custom)).toEqual(true);
    });
    test("should return false if the MessageSystemType does not match", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const callback3: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            updateMonacoModelPosition: callback3,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.initialize)).toEqual(false);
    });
});
