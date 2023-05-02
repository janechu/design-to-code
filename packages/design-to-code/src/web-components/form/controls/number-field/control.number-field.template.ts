import { html, ref } from "@microsoft/fast-element";
import dtcClassName from "../../../style/class-names.js";
import { NumberFieldControl } from "./control.number-field.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<NumberFieldControl>`
    <template>
        <style>
            .dtc-common-input {
                appearance: none;
                background: none;
                border: none;
                margin: 0;
                padding: 4px 6px;
                border-radius: var(--dtc-border-radius);
                height: 24px;
            }

            .dtc-common-input:focus-visible {
                box-shadow: inset 0 0 0 1px var(--dtc-accent-color);
                outline: none;
            }

            .dtc-common-input + svg {
                fill: var(--dtc-text-color);
            }

            .dtc-common-input:disabled + svg {
                opacity: var(--dtc-disable-opacity);
            }
        </style>
        <style>
            .dtc-common-default-font {
                color: var(--dtc-text-color);
            }
        </style>
        <input
            class="${x =>
                x.disabled
                    ? `dtc-number-field-control ${dtcClassName.commonInput} dtc-number-field-control__disabled`
                    : `dtc-number-field-control ${dtcClassName.commonInput}`}${x =>
                x.default
                    ? `dtc-number-field-control__default ${dtcClassName.commonDefaultFont}`
                    : ""}"
            id="${x => x.dataLocation}"
            type="number"
            :value="${x => (x.value ? x.value.toString() : "")}"
            name="${x => x.dataLocation}"
            data-location="${x => x.dataLocation}"
            @change="${x => x.handleChange()}"
            min="${x => x.min}"
            max="${x => x.max}"
            step="${x => x.step}"
            ?disabled="${x => x.disabled}"
            @blur="${x => x.updateValidity}"
            @focus="${x => x.reportValidity}"
            ?required="${x => x.required}"
            ${ref("numberfield")}
        />
    </template>
`;
