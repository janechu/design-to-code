import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class ArrayControl extends FASTElement {
    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ attribute: "invalid-message" })
    invalidMessage: string;

    @attr
    maxItems: number;

    @attr
    minItems: number;

    @attr({ attribute: "display-validation-inline", mode: "boolean" })
    displayValidationInline: boolean;

    @observable
    default: Array<unknown>;

    @observable
    value: Array<unknown>;

    public renderValidationError(index: number) {
        return this.invalidMessage;
    }

    public arrayClickHandlerFactory(index: number) {
        return (e: Event) => {
            // TODO: emit a change event
        };
    }
}
