import { attr, FASTElement, observable } from "@microsoft/fast-element";

interface Control extends HTMLElement {
    value: any;
    schema: any;
}

export class StandardFrame extends FASTElement {
    @attr({ mode: "boolean" })
    disabled: boolean;

    @attr
    label: string;

    @attr({ attribute: "data-location" })
    dataLocation: string;

    @attr
    control: string;

    @observable
    value: any;

    @observable
    schema: any;

    div: HTMLDivElement;

    public connectedCallback(): void {
        super.connectedCallback();

        const control = document.createElement(this.control) as Control;
        control.value = this.value;
        control.schema = this.schema;
        control.setAttribute("data-location", this.dataLocation);

        this.div.appendChild(control);
    }
}
