import {
    AjvMapper,
    MessageSystem,
    MonacoAdapter,
    MonacoAdapterAction,
} from "design-to-code";
import { mapDataDictionaryToMonacoEditorHTML } from "design-to-code/dist/esm/data-utilities/monaco.js";
import { monacoAdapterId } from "design-to-code/dist/esm/message-system-service/monaco-adapter.service.js";

/**
 * These utilities are used for testing in browser
 */
(window as any).dtc = {
    AjvMapper,
    MessageSystem,
    MonacoAdapter,
    MonacoAdapterAction,
    mapDataDictionaryToMonacoEditorHTML,
    monacoAdapterId,
};
