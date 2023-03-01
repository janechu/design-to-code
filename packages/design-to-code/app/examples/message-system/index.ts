import {
    AjvMapper,
    MessageSystem,
    MonacoAdapter,
    MonacoAdapterAction,
    Shortcuts,
    ShortcutsActionDelete,
    ShortcutsActionDuplicate,
    ShortcutsActionRedo,
    ShortcutsActionUndo,
} from "design-to-code";
import { ShortcutsAction } from "design-to-code/dist/esm/message-system-service/shortcuts.service-action.js";
import { mapDataDictionaryToMonacoEditorHTML } from "design-to-code/dist/esm/data-utilities/monaco.js";
import { monacoAdapterId } from "design-to-code/dist/esm/message-system-service/monaco-adapter.service.js";
import { shortcutsId } from "design-to-code/dist/esm/message-system-service/shortcuts.service.js";
import dataDictionary from "design-to-code/dist/esm/message-system-service/shortcuts-service-actions/__test__/data-dictionary.js";
import schemaDictionary from "design-to-code/dist/esm/message-system-service/shortcuts-service-actions/__test__/schema-dictionary.js";

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
    Shortcuts,
    ShortcutsAction,
    ShortcutsActionDelete,
    ShortcutsActionDuplicate,
    ShortcutsActionRedo,
    ShortcutsActionUndo,
    shortcutsId,
    dataDictionary,
    schemaDictionary,
};
