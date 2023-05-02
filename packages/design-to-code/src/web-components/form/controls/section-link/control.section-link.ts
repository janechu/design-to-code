import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class SectionLinkControl extends FASTElement {
    @attr({ attribute: "invalid-message" })
    invalidMessage: string;

    @attr
    label: string;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @observable
    strings: { [key: string]: string };

    @observable
    value: any;

    @observable
    default: any;

    public handleUpdateSection = () => {
        this.$emit("change"); // TODO: should pass a dictionary id and navigation config id
    };
}
