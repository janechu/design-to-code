import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class NumberFieldControl extends FASTElement {
    @attr({ attribute: "data-location" })
    dataLocation: string;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ mode: "boolean" })
    required: boolean;

    @observable
    value: any;

    @attr
    default: number;

    @attr
    min: number;

    @attr
    max: number;

    @attr
    step: number;

    @attr
    numberfield: HTMLInputElement;

    public handleChange = () => {
        this.value = parseInt(this.numberfield.value, 10);

        this.$emit("change");
    };

    public reportValidity = () => {
        this.$emit("dtc:form:report-validity");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };
}
