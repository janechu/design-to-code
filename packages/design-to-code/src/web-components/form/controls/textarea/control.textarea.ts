import { attr, FASTElement } from "@microsoft/fast-element";

export class TextareaControl extends FASTElement {
    @attr
    value: string;

    @attr
    default: string;

    @attr({ attribute: "data-location" })
    dataLocation: string;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ mode: "boolean" })
    required: boolean;

    @attr
    rows: string;

    @attr
    textarea: HTMLTextAreaElement;

    private focused: boolean = false;

    public reportValidity = () => {
        this.$emit("dtc:form:report-validity");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };

    public getRows(): number {
        return typeof this.rows === "number" ? this.rows : 3;
    }

    public handleFocus(): void {
        this.reportValidity();

        this.focused = true;
    }

    public handleBlur(): void {
        this.updateValidity();

        this.focused = false;
    }

    public handleChange(): void {
        this.value = this.textarea.value;

        this.$emit("change");
    }

    public getValue(): string {
        // Return undefined to allow typing anywhere other than the end of the string
        // when the typing is occuring in the textarea
        if (this.focused) {
            return;
        }

        return typeof this.value === "string"
            ? this.value
            : typeof this.default === "string"
            ? this.default
            : "";
    }
}
