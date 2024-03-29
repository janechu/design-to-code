import React, { useCallback, useEffect, useState } from "react";
import {
    DataType,
    InitializeMessageIncoming,
    MessageSystem,
    MessageSystemType,
} from "design-to-code";
import { ModularForm, ModularNavigation, ModularViewer } from "design-to-code-react";
import "./editor.css";
import MessageSystemWorker from "design-to-code/dist/message-system.min.js";
import { MonacoEditor } from "./monaco-editor";
import { ScreenSelect } from "./screen-select";
import { deviceOrScreenSize } from "./screen-select.constants";
import {
    initialDataDictionary,
    initialSchemaDictionary,
    originatedByEditor,
    requestPreviewInitialize,
} from "../../shared/constants";

const messageSystem = new MessageSystem({
    webWorker: new MessageSystemWorker(),
});

const handleMessageSystem = e => {
    if (e.data?.value === requestPreviewInitialize) {
        messageSystem.postMessage({
            type: MessageSystemType.initialize,
            dataDictionary: initialDataDictionary,
            schemaDictionary: initialSchemaDictionary,
            options: {
                originatorId: originatedByEditor,
            },
        } as InitializeMessageIncoming);
    }
};

export function Editor() {
    const messageSystemConfig = {
        onMessage: handleMessageSystem,
    };
    const [viewWidth, setViewWidth] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const [screenId, setScreenId] = useState("none");

    useEffect(() => {
        messageSystem.add(messageSystemConfig);

        return () => {
            messageSystem.remove(messageSystemConfig);
        };
    });

    const onViewRefChange = useCallback(node => {
        if (node !== null) {
            const { height, width } = getComputedStyle(node);

            setViewWidth(parseInt(width.slice(0, -2), 10));
            setViewHeight(parseInt(height.slice(0, -2), 10));
        }
    }, []);

    const onSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = deviceOrScreenSize.find(
            screenSize => e.target.value === screenSize.id
        );

        setViewWidth(size.width);
        setViewHeight(size.height);
        setScreenId(size.id);
    };

    return (
        <main className="editor">
            <nav className="editor-toolbar">
                <span className="editor-badge">1.0.0-alpha.1</span>
                <ScreenSelect handleChange={onSizeChange} screenId={screenId} />
            </nav>
            <div className="editor-container">
                <div className="editor-left-rail">
                    <ModularNavigation
                        messageSystem={messageSystem}
                        types={[DataType.object]}
                    />
                </div>
                <div className="editor-view">
                    <div className="editor-view-viewer" ref={onViewRefChange}>
                        <ModularViewer
                            height={viewHeight}
                            width={viewWidth}
                            onUpdateHeight={e => {
                                setScreenId("none");
                                return setViewHeight(e);
                            }}
                            onUpdateWidth={e => {
                                setScreenId("none");
                                return setViewWidth(e);
                            }}
                            iframeSrc={"./preview"}
                            messageSystem={messageSystem}
                            responsive={true}
                        />
                    </div>
                    <div className="editor-view-monaco">
                        <MonacoEditor messageSystem={messageSystem} />
                    </div>
                </div>
                <div className="editor-right-rail">
                    <ModularForm messageSystem={messageSystem} />
                </div>
            </div>
        </main>
    );
}
