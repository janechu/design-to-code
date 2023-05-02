import { html, repeat, when } from "@microsoft/fast-element";
import * as DTCSwitchControl from "../switch/control.switch.define.js";
import { FormSectionControl } from "./control.section.js";

// tree-shaking
DTCSwitchControl;

/**
 * The template for the form component.
 * @public
 */
export const template = html<FormSectionControl>`
    <template>
        <fieldset
            class="${x =>
                x.disabled
                    ? "dtc-section-control"
                    : "dtc-section-control dtc-section-control__disabled"}"
            disabled="${x => x.disabled}"
        >
            <slot name="validation">
                <!-- {renderFormValidation(invalidMessage)} -->
            </slot>
            <div>
                <div>
                    <!-- {renderAnyOfOneOfSelect()} -->
                    ${when(
                        x => x.isRootLevelObject(),
                        html`
                            ${repeat(
                                x => x.navigationItem.items,
                                html`
                                    ${(x, c) => {
                                        return html`
                                            <dtc-switch
                                                array-control="${(x, c) =>
                                                    c.parent.arrayControl}"
                                                button-control="${(x, c) =>
                                                    c.parent.buttonControl}"
                                                checkbox-control="${(x, c) =>
                                                    c.parent.checkboxControl}"
                                                display-control="${(x, c) =>
                                                    c.parent.displayControl}"
                                                number-field-control="${(x, c) =>
                                                    c.parent.numberFieldControl}"
                                                section-link-control="${(x, c) =>
                                                    c.parent.sectionLinkControl}"
                                                select-control="${(x, c) =>
                                                    c.parent.selectControl}"
                                                textarea-control="${(x, c) =>
                                                    c.parent.textareaControl}"
                                                property-name="${x}"
                                                :data="${(x, c) =>
                                                    c.parent.navigation[x].data}"
                                                :schema="${(x, c) =>
                                                    c.parent.navigation[x].schema}"
                                            ></dtc-switch>
                                        `;
                                    }}
                                `
                            )}
                        `
                    )}
                    ${when(
                        x => !x.isRootLevelObject(),
                        html`
                            <slot name="control-switch">
                                <dtc-switch
                                    :data="${x => x.data}"
                                    :schema="${x => x.schema}"
                                ></dtc-switch>
                            </slot>
                        `
                    )}
                    <slot name="additional-properties">
                        <!-- {renderAdditionalProperties()} -->
                    </slot>
                </div>
            </div>
        </fieldset>
    </template>
`;
