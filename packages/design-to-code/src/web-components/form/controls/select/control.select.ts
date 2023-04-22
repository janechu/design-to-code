import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class SelectControl extends FASTElement {
    @attr
    default: string;

    @observable
    value: any;

    @observable
    schema: any;
    schemaChanged(oldValue: any, newValue: any) {
        this.options = newValue.enum;
    }

    @attr({ mode: "boolean" })
    required: boolean;

    @attr({ mode: "boolean" })
    disabled: boolean;

    @observable
    options: Array<unknown>;

    @attr
    select: HTMLSelectElement;

    public getValue(): any {
        return typeof this.value !== "undefined"
            ? this.value
            : typeof this.default !== "undefined"
            ? this.default
            : "";
    }

    public stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    public handleChange() {
        this.value = this.options.find((option: any): any => {
            return typeof option === "string"
                ? option === this.select.value
                : JSON.stringify(option) === this.select.value;
        });

        this.$emit("change");
    }

    public reportValidity = () => {
        this.$emit("dtc:form:report-validity");
    };

    public updateValidity = () => {
        this.$emit("dtc:form:update-validity");
    };
}
