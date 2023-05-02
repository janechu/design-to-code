import { html } from "@microsoft/fast-element";
import { ArrayAction } from "../../frames/types.js";
import dtcClassName from "../../../style/class-names.js";
import { getArrayLinks } from "../../utilities/form.js";
import { ArrayControl } from "./control.array.js";

/**
 * Renders an default array link item
 */
function renderDefaultArrayLinkItem(value: any, index: number) {
    return html`
        <li class="dtc-array-control_existing-item-list-item">
            <span
                class="dtc-array-control_existing-item-list-item-link ${dtcClassName.commonDefaultFont} ${dtcClassName.commonEllipsis} dtc-array-control_existing-item-list-item-link__default"
            >
                ${value}
            </span>
        </li>
    `;
}

/**
 * Renders default array items
 */
function renderDefaultArrayLinkItems(x: ArrayControl) {
    return getArrayLinks(x.default).map((value: any, index: number) => {
        return renderDefaultArrayLinkItem(value, index);
    });
}

/**
 * Render UI for all items in an array
 */
function renderArrayLinkItems(x: ArrayControl) {
    return getArrayLinks(x.value).map((text: string, index: number) => {
        const invalidError = x.renderValidationError(index);

        // TODO: this should be a draggable item
        return html`
            <li class="dtc-array-control_existing-item-list-item">
                <a
                    class="dtc-array-control_existing-item-list-item-link"
                    @click="${x.arrayClickHandlerFactory(index)}"
                >
                    ${text}
                </a>
                {renderDeleteArrayItemTrigger(index)}
            </li>
            ${x.displayValidationInline ? invalidError : null}
        `;
    });
}

/**
 * Renders the links to an array section to be activated
 */
function renderExistingArrayItems(x: ArrayControl) {
    const hasData: boolean = Array.isArray(x.value);
    const hasDefault: boolean = Array.isArray(x.default);

    if (hasData) {
        return html`
            <ul
                class="dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}"
            >
                ${renderArrayLinkItems(x)}
            </ul>
        `;
    }

    if (hasDefault) {
        return html`
            <ul
                class="dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}"
            >
                ${renderDefaultArrayLinkItems(x)}
            </ul>
        `;
    }

    return html`
        <ul
            class="dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}"
        ></ul>
    `;
}

function renderAddArrayItemTrigger() {
    return html`
        <button
            class="dtc-array-control_add-item-button ${dtcClassName.commonAddItem}"
            aria-label="${x => x.strings.arrayAddItemTip}"
            @click="${x => x.arrayItemClickHandlerFactory(ArrayAction.add)}"
        />
    `;
}

function renderAddArrayItem(x: ArrayControl) {
    const existingItemLength: number = Array.isArray(x.value) ? x.value.length : 0;

    if (x.maxItems > existingItemLength) {
        return html`
            <div class="dtc-array-control_add-item ${dtcClassName.commonLabelRegion}">
                <div class="dtc-array-control_add-item-label ${dtcClassName.commonLabel}">
                    ${x => x.strings.arrayAddItemLabel}
                </div>
                ${renderAddArrayItemTrigger()}
            </div>
        `;
    }
}

/**
 * The template for the form component.
 * @public
 */
export const template = html<ArrayControl>`
    <div
        class="${x =>
            x.disabled
                ? "dtc-array-control dtc-array-control__disabled"
                : "dtc-array-control"}${x =>
            x.invalidMessage !== "" ? " dtc-array-control__invalid" : ""}"
    >
        ${x => renderAddArrayItem(x)} ${x => renderExistingArrayItems(x)}
    </div>
`;
