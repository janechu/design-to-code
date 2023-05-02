import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    TreeNavigation,
    TreeNavigationItem,
} from "../../../../message-system/navigation.props.js";
import { OneOfAnyOfState } from "../../utilities/types.js";

export class FormSectionControl extends FASTElement {
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

    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr({ attribute: "data-location" })
    dataLocation: string;

    @observable
    data: any;

    @observable
    schema: any;

    @observable
    navigation: TreeNavigation;

    @observable
    navigationItem: TreeNavigationItem;

    @observable
    oneOfAnyOf: OneOfAnyOfState | null = null;

    private propertyName: string = "";

    public isRootLevelObject(): boolean {
        return (
            this.schema.type === "object" &&
            this.propertyName === "" &&
            this.oneOfAnyOf === null
        );
    }

    public connectedCallback(): void {
        super.connectedCallback();

        const splitDataLocation: string[] =
            this.navigation[this.dataLocation].relativeDataLocation.split(".");
        this.propertyName = splitDataLocation[splitDataLocation.length - 1];
    }
}
