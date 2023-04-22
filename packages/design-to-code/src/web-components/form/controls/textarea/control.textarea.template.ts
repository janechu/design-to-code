import { html, ref } from "@microsoft/fast-element";
import { TextareaControl } from "./control.textarea.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<TextareaControl>`
    <textarea
        class="dtc-textarea-control${x =>
            x.disabled ? " dtc-textarea-control__disabled" : ""}${x =>
            x.default === x.value ? " dtc-textarea-control__default" : ""}"
        id="${x => x.dataLocation}"
        name="${x => x.dataLocation}"
        data-location="${x => x.dataLocation}"
        rows="${x => x.getRows()}"
        :value="${x => x.getValue()}"
        @change="${x => x.handleChange()}"
        ?disabled="${x => x.disabled}"
        @focus="${x => x.handleFocus}"
        @blur="${x => x.handleBlur}"
        ?required="${x => x.required}"
        ${ref("textarea")}
    />
`;
