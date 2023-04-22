import { html, ref, repeat } from "@microsoft/fast-element";
import dtcClassName from "../../../style/class-names.js";
import { SelectControl } from "./control.select.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<SelectControl>`
    <template>
        <style>
            .dtc-common-select-span {
                position: relative;
                display: flex;
            }

            .dtc-common-select-span::before {
                content: "";
                position: absolute;
                top: 10px;
                right: 6px;
                border-left: 3px solid transparent;
                border-right: 3px solid transparent;
                border-top: 3px solid var(--dtc-text-color);
            }
        </style>
        <style>
            [dir="rtl"] .dtc-common-select-input {
                padding: 3px 5px 2px 16px;
            }

            [dir="ltr"] .dtc-common-select-input {
                padding: 3px 16px 2px 5px;
            }

            .dtc-common-select-input {
                width: 100%;
                line-height: 16px;
                font-size: var(--dtc-text-size-default);
                background: var(--dtc-l1-color);
                border-radius: var(--dtc-border-radius);
                appearance: none;
                outline: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                border: none;
                color: var(--dtc-text-color);
                padding: 4px 6px;
            }

            .dtc-common-select-input:-ms-expand {
                display: none;
            }

            .dtc-common-select-input option {
                background: var(--dtc-l4-color);
            }

            .dtc-common-select-input:disabled {
                cursor: not-allowed;
            }

            .dtc-common-select-input:focus {
                box-shadow: inset 0 0 0 1px var(--dtc-accent-color);
            }

            .dtc-common-select-input:invalid {
                border: 1px solid var(--dtc-error-color);
            }
        </style>
        <style>
            .dtc-common-default-font {
                color: var(--dtc-text-color);
            }
        </style>
        <span
            class="dtc-select-control ${dtcClassName.commonSelectSpan}${x =>
                x.disabled ? " dtc-select-control__disabled" : ""}${x =>
                x.default === x.value
                    ? ` dtc-select-control__default ${dtcClassName.commonDefaultFont}`
                    : ""}"
        >
            <select
                class="dtc-select-control_input ${dtcClassName.commonSelectInput}"
                @change="${x => x.handleChange()}"
                :value="${x => x.getValue()}"
                ?disabled="${x => x.disabled}"
                @blur="${x => x.updateValidity}"
                @focus="${x => x.reportValidity}"
                ?required="${x => x.required}"
                ${ref("select")}
            >
                ${repeat(
                    x => x.options,
                    html`
                        <option value="${x => x}">
                            ${x =>
                                typeof x === "string" || typeof x === "number"
                                    ? x
                                    : x.parent.stringify(x)}
                        </option>
                    `
                )}
            </select>
        </span>
    </template>
`;
