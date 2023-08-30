import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { XOR } from "../../../../data-utilities/type.utilities.js";
import { ControlType } from "../../utilities/types.js";
import { dictionaryLink } from "../../../../index.js";
import { isConst, isSelect } from "../../utilities/form.js";

export class SwitchControl extends FASTElement {
    @attr({ attribute: "array-control" })
    arrayControl: string;

    @attr({ attribute: "button-control" })
    buttonControl: string;

    @attr({ attribute: "checkbox-control" })
    checkboxControl: string;

    @attr({ attribute: "display-control" })
    displayControl: string;

    @attr({ attribute: "number-field-control" })
    numberFieldControl: string;

    @attr({ attribute: "section-link-control" })
    sectionLinkControl: string;

    @attr({ attribute: "select-control" })
    selectControl: string;

    @attr({ attribute: "textarea-control" })
    textareaControl: string;

    @observable
    schema: any;

    @observable
    data: any;

    @attr({ attribute: "property-name" })
    propertyName: string;

    /**
     * Whether this is the root location
     */
    @attr({ mode: "boolean" })
    root: boolean;

    public getLabel(): string {
        return this.schema.title;
    }

    public getControlType(): XOR<ControlType, null> {
        if (typeof this.schema === "undefined") {
            return null;
        }

        if (this.schema[dictionaryLink]) {
            return ControlType.linkedData;
        }

        const hasEnum: boolean = isSelect({ enum: this.schema.enum });

        if (isConst(this.schema) || (hasEnum && this.schema.enum.length === 1)) {
            return ControlType.display;
        }

        if (hasEnum) {
            return ControlType.select;
        }

        if (this.schema.oneOf || this.schema.anyOf) {
            return ControlType.sectionLink;
        }

        switch (this.schema.type) {
            case "boolean":
                return ControlType.checkbox;
            case "number":
                return ControlType.numberField;
            case "string":
                return ControlType.textarea;
            case "array":
                return ControlType.array;
            case "null":
                return ControlType.button;
            default:
                return ControlType.sectionLink;
        }
    }
}
