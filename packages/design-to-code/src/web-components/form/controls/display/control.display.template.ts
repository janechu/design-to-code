import { html } from "@microsoft/fast-element";
import dtcClassName from "../../../style/class-names.js";
import { DisplayControl } from "./control.display.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<DisplayControl>`
    <input
        class="${x =>
            x.disabled
                ? `dtc-display-control ${dtcClassName.commonInput} dtc-display-control__disabled`
                : `dtc-display-control ${dtcClassName.commonInput}`}${x =>
            x.value === x.default ? " dtc-display-control__default" : ""}"
        type="text"
        @blur="${x => x.updateValidity}"
        @focus="${x => x.reportValidity}"
        @change="${x => x.handleChange}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
        value="${x => x.value}"
    />
`;
