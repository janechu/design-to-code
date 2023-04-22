import { html } from "@microsoft/fast-element";
import dtcClassName from "../../../style/class-names.js";
import { ButtonControl } from "./control.button.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<ButtonControl>`
    <button
        class="dtc-button-control ${dtcClassName.commonInput}${x =>
            x.disabled ? "dtc-button-control__disabled" : ""}${x =>
            x.default === x.value
                ? `dtc-button-control__default ${dtcClassName.commonDefaultFont}`
                : ""}"
        @blur="${x => x.updateValidity}"
        @focus="${x => x.reportValidity}"
        @click="${x => x.handleButtonClick()}"
        ?disabled="${x => x.disabled}"
    >
        Set to null
    </button>
    <input
        id="${x => x.dataLocation}"
        ?hidden="${true}"
        :value=${x => x.value || ""}
        ?disabled=${x => x.disabled}
        ?required=${x => x.required}
    />
`;
