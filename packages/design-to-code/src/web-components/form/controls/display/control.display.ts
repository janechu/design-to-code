import { attr, FASTElement } from "@microsoft/fast-element";

export class DisplayControl extends FASTElement {
    @attr({ attribute: "data-location" })
    dataLocation: string;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr
    value: null;

    @attr
    default: null;

    @attr({ mode: "boolean" })
    required: boolean;

    public handleChange = () => {
        this.$emit("change");
    };

    public reportValidity = () => {
        this.$emit("dtc:form:report-validity");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };
}
