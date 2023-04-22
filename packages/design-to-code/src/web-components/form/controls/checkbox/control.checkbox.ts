import { attr, FASTElement } from "@microsoft/fast-element";

export class CheckboxControl extends FASTElement {
    @attr({ attribute: "data-location" })
    dataLocation: string;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ mode: "boolean" })
    value: boolean;

    @attr({ mode: "boolean" })
    default: boolean;

    @attr
    checkbox: HTMLInputElement;

    /**
     * Fast Element lifecycle hook
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (typeof this.value !== "boolean") {
            this.value = this.default;
        }
    }

    public handleChange = e => {
        this.value = this.checkbox.checked;

        this.$emit("change");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };
}
