import { attr, FASTElement } from "@microsoft/fast-element";

export class BareFrame extends FASTElement {
    @attr({ mode: "boolean" })
    disabled: boolean;
}
