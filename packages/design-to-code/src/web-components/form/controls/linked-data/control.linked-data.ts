import { attr, FASTElement } from "@microsoft/fast-element";

export class LinkedDataControl extends FASTElement {
    @attr({ mode: "boolean" })
    disabled: boolean;
}
