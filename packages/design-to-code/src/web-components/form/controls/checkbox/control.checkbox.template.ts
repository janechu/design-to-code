import { html, ref } from "@microsoft/fast-element";
import { CheckboxControl } from "./control.checkbox.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<CheckboxControl>`
    <div
        class="dtc-checkbox-control${x =>
            x.disabled ? " dtc-checkbox-control__disabled" : ""}${x =>
            typeof x.default !== "undefined" ? " dtc-checkbox-control__default" : ""}"
    >
        <input
            class="dtc-checkbox-control_input"
            id="${x => x.dataLocation}"
            type="checkbox"
            ?checked="${x => x.value}"
            ?disabled="${x => x.disabled}"
            @change="${(x, c) => x.handleChange(c.event)}"
            @blur="${x => x.updateValidity}"
            ${ref("checkbox")}
        />
        <span class="dtc-checkbox-control_checkmark"></span>
    </div>
`;
