import React, { useCallback, useEffect, useState } from "react";
import { MessageSystem, MonacoAdapter, monacoAdapterId } from "design-to-code";
import { mapDataDictionaryToMonacoEditorHTML } from "design-to-code/dist/esm/data-utilities/monaco";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import { setValueAction } from "./monaco-editor.actions";
import { originatedByPreview } from "../../shared/constants";

export interface MonacoEditorProps {
    messageSystem: MessageSystem;
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
    editorOptions
) {
    return monacoRef.editor.create(containerRef, {
        value: "",
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
    let editor = null;
    let editorNode = null;
    let adapter = null;

    const [lastStoredEditorValue, setLastStoredEditorValue] = useState("");
    const [initialized, setInitialized] = useState(false);

    const onRefChange = useCallback(node => {
        if (node !== null) {
            editorNode = node;
        }
    }, []);

    useEffect(() => {
        if (editorNode && !initialized) {
            setInitialized(true);
            props.messageSystem.add({ onMessage: handleMessageSystem });
            editor = createMonacoEditor(monaco, editorNode, {});
            adapter = createMonacoAdapter(props.messageSystem, editor);
            setupMonacoListeners(editor, adapter);
        }

        return () => {
            if (initialized) {
                setInitialized(false);
                props.messageSystem.remove({
                    onMessage: handleMessageSystem,
                });
                editor.dispose();
                adapter.destroy();
            }
        };
    }, [initialized]);

    function setupMonacoListeners(editor, adapter) {
        editor.onDidChangeModelContent(e => {
            // determine if data dictionary must be updated
            if (!e.isFlush && lastStoredEditorValue !== editor.getValue()) {
                adapter.action("monaco.setValue").run();
            }
        });
    }

    function handleMessageSystem(e: MessageEvent) {
        if (editor && e.data.options?.originatorId !== originatedByPreview) {
            if (e.data.options?.originatorId === monacoAdapterId) {
                setLastStoredEditorValue(editor.getValue());
            } else if (e.data.options?.originatorId !== originatedByPreview) {
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
