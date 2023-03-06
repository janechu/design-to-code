import React, { useCallback, useState } from "react";
import { MessageSystem, MonacoAdapter, monacoAdapterId } from "design-to-code";
import { mapDataDictionaryToMonacoEditorHTML } from "design-to-code/dist/esm/data-utilities/monaco";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import { setValueAction } from "./monaco-editor.actions";

export interface MonacoEditorProps {
    messageSystem: MessageSystem;
    initialValue: string;
}

/**
 * Creates the monaco adapter instance
 */
function createMonacoAdapter(messageSystem: MessageSystem, editor): MonacoAdapter {
    return new MonacoAdapter({
        messageSystem,
        actions: [setValueAction(editor)],
    });
}

/**
 * Creates the monaco-editor instance
 */
function createMonacoEditor(
    monacoRef,
    containerRef: React.MutableRefObject<unknown>,
    editorOptions,
    initialValue: string
) {
    return monacoRef.editor.create(containerRef, {
        value: initialValue,
        automaticLayout: true,
        language: "html",
        formatOnPaste: true,
        lineNumbers: "off",
        theme: "vs-dark",
        wordWrap: "on",
        wordWrapColumn: 80,
        wordWrapMinified: true,
        wrappingIndent: "same",
        minimap: {
            showSlider: "mouseover",
        },
        ...editorOptions,
    });
}

export function MonacoEditor(props: MonacoEditorProps) {
    let editor;
    props.messageSystem.add({ onMessage: handleMessageSystem });

    const [lastStoredEditorValue, setLastStoredEditorValue] = useState(
        props.initialValue
    );

    const onRefChange = useCallback(node => {
        if (node !== null) {
            editor = createMonacoEditor(monaco, node, {}, "");
            const adapter = createMonacoAdapter(props.messageSystem, editor);
            setupMonacoListeners(editor, adapter);
        }
    }, []);

    function setupMonacoListeners(editor, adapter) {
        editor.onDidChangeModelContent(e => {
            // determine if data dictionary must be updated
            if (!e.isFlush && lastStoredEditorValue !== editor.getValue()) {
                adapter.action("monaco.setValue").run();
            }
        });
    }

    function handleMessageSystem(e: MessageEvent) {
        if (editor) {
            if (e.data.options?.originatorId === monacoAdapterId) {
                setLastStoredEditorValue(editor.getValue());
            } else {
                const newMonacoValue = html_beautify(
                    mapDataDictionaryToMonacoEditorHTML(
                        e.data.dataDictionary,
                        e.data.schemaDictionary
                    )
                );
                setLastStoredEditorValue(newMonacoValue);
                editor.setValue(newMonacoValue);
            }
        }
    }

    return <div ref={onRefChange} style={{ height: "100%" }}></div>;
}
