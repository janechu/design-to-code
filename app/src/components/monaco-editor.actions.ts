import {
    MessageSystemType,
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
} from "design-to-code";

const setValueAction = editor => {
    return new MonacoAdapterAction({
        id: "monaco.setValue",
        messageSystemType: MessageSystemType.data,
        action: (config: MonacoAdapterActionCallbackConfig): void => {
            // trigger an update to the monaco value that
            // also updates the DataDictionary which fires a
            // postMessage to the MessageSystem if the update
            // is coming from Monaco and not a data dictionary update
            config.updateMonacoModelValue([editor.getValue()], false);
        },
    });
};

export { setValueAction };
