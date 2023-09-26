import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "../../message-system/index.js";

interface AjvMessage {
    invalidMessage: string;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
}

export class AjvValidatorMessages extends FASTElement {
    @attr({ mode: "boolean", attribute: "show-success" })
    showSuccess: boolean;

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void {
        if (this.messageSystem !== undefined) {
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data.type === "validation") {
            this.errors = e.data.validationErrors;
        }
    };

    @observable
    public errors: AjvMessage[] = [];

    public handleMessageClick = (message: AjvMessage): void => {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: message.activeDictionaryId,
            activeNavigationConfigId: message.activeNavigationConfigId,
        });
    };
}
