import { MessageSystem, MessageSystemType } from "design-to-code";
import { HTMLRender } from "design-to-code/dist/esm/web-components/html-render/html-render.js";
import { DTCHTMLRender } from "design-to-code/dist/esm/web-components/html-render/html-render.define";
import { DTCHTMLRenderLayerNavigation } from "design-to-code/dist/esm/web-components/html-render-layer-navigation/html-render-layer-navigation.define";
import { DTCHTMLRenderLayerInlineEdit } from "design-to-code/dist/esm/web-components/html-render-layer-inline-edit/html-render-layer-inline-edit.define";
import { nativeElementDefinitions } from "design-to-code/dist/esm/definitions";
import MessageSystemWorker from "design-to-code/dist/message-system.min.js";
import { originatedByPreview, requestPreviewInitialize } from "../shared/constants";

// tree-shaking
DTCHTMLRender;
DTCHTMLRenderLayerInlineEdit;
DTCHTMLRenderLayerNavigation;

document.body.setAttribute("style", "margin: 0");
window.addEventListener("message", handleMessageSystem);

const messageSystem = new MessageSystem({
    webWorker: new MessageSystemWorker(),
});

messageSystem.add({
    onMessage: handleMessageSystem,
});

function handleMessageSystem(message: MessageEvent) {
    if (message.origin === location.origin) {
        let messageData: unknown;

        try {
            messageData = JSON.parse(message.data);
        } catch (e) {
            return;
        }

        if (
            messageData !== undefined &&
            (messageData as any)?.options?.originatorId !== originatedByPreview &&
            (messageData as any)?.type === MessageSystemType.initialize // TODO: this "fix" does not address the core problem that messages are not syncing on different message types, we should investigate why this is happening and sync all message systems
        ) {
            messageSystem.postMessage(messageData as unknown as any);
        }
    }
}

const htmlRender: HTMLRender = document.getElementById("htmlRender") as HTMLRender;
htmlRender.markupDefinitions = Object.values(nativeElementDefinitions);
htmlRender.messageSystem = messageSystem;

window.postMessage(
    {
        type: MessageSystemType.custom,
        action: "call",
        value: requestPreviewInitialize,
        options: {
            originatorId: originatedByPreview,
        },
    },
    "*"
);
