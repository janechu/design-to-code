import React from "react";
import { DataType, MessageSystem } from "design-to-code";
import { ModularForm, ModularNavigation } from "design-to-code-react";
import { schemaDictionary } from "../configs/native.schema-dictionary";
import "./editor.css";
import MessageSystemWorker from "design-to-code/dist/message-system.min.js";

const messageSystem = new MessageSystem({
    webWorker: new MessageSystemWorker(),
    dataDictionary: [
        {
            root: {
                schemaId: "div",
                data: {},
            },
        },
        "root",
    ],
    schemaDictionary,
});

export function Editor() {
    return (
        <main className="editor">
            <nav className="editor-toolbar">header</nav>
            <div className="editor-container">
                <div className="editor-left-rail">
                    <ModularNavigation
                        messageSystem={messageSystem}
                        types={[DataType.object]}
                    />
                </div>
                <div className="editor-view">view</div>
                <div className="editor-right-rail">
                    <ModularForm messageSystem={messageSystem} />
                </div>
            </div>
        </main>
    );
}
