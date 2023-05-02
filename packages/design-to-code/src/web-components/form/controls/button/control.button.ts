import { attr, FASTElement } from "@microsoft/fast-element";

export class ButtonControl extends FASTElement {
    @attr({ mode: "boolean" })
    required: boolean;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ attribute: "invalid-message" })
    invalidMessage: string;

    @attr
    value: null;

    @attr
    default: null;

    @attr({ attribute: "data-location" })
    dataLocation: string;

    public reportValidity = () => {
        this.$emit("dtc:form:report-validity");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };

    public handleButtonClick(): (e) => void {
        return (e): void => {
            e.preventDefault();

            this.$emit("change", { value: null });
        };
    }
}
