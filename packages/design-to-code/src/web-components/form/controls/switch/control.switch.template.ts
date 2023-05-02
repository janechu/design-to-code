import { html } from "@microsoft/fast-element";
import { ControlType } from "../../utilities/types.js";
import * as DTCStandardFrame from "../../frames/standard/frame.standard.define.js";
import { SwitchControl } from "./control.switch.js";

// tree-shaking
DTCStandardFrame;

function renderControl(propertyName: string, controlType: ControlType) {
    const dataLocation = propertyName;

    switch (controlType) {
        case ControlType.array:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.arrayControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        case ControlType.button:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.buttonControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        case ControlType.checkbox:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.checkboxControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        case ControlType.display:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.displayControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        case ControlType.numberField:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.numberFieldControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        case ControlType.select:
            return html`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.selectControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                    :schema="${x => x.schema}"
                ></dtc-frame-standard>
            `;
        case ControlType.textarea:
            return html<SwitchControl>`
                <dtc-frame-standard
                    label="${x => x.getLabel()}"
                    control="${x => x.textareaControl}"
                    data-location="${dataLocation}"
                    :value="${x => x.data}"
                ></dtc-frame-standard>
            `;
        default:
            return null;
    }
}

/**
 * The template for the form component.
 * @public
 */
export const template = html<SwitchControl>`
    <template>${x => renderControl(x.propertyName, x.getControlType())}</template>
`;
