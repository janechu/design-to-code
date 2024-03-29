import { html } from "@microsoft/fast-element";
import { CSSBoxModel, expandableSection } from "./css-box-model.js";

const sidesButton = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M5 1H11V2H5V1Z" />
        <path d="M14 5H15V11H14V5Z" />
        <path d="M1 5H2V11H1V5Z" />
        <path d="M5 14H11V15H5V14Z" />
    </svg>
`;

/**
 * The template for the box-model component.
 * @public
 */
export const cssBoxModelTemplate = html<CSSBoxModel>`
    <template>
        <div class="section">
            <label for="margin" class="section-label">Margin</label>
            <br />
            <div
                class="${x =>
                    x.marginOpen ? "single-input single-input__hidden" : "single-input"}"
            >
                <dtc-units-text-field
                    id="margin"
                    title="margin"
                    tabindex="1"
                    :value="${x => x.uiValues.margin.getCSSShorthandFourValues()}"
                    @change="${(x, c) => x.handleInputChange("margin", c.event)}"
                ></dtc-units-text-field>
                <button
                    class="layout-button"
                    @click="${(x, c) =>
                        x.handleOpenButtonClick(expandableSection.margin)}"
                >
                    ${sidesButton}
                </button>
            </div>
            <div class="${x => (x.marginOpen ? "grid" : "grid grid__hidden")}">
                <div class="item item-top">
                    <dtc-units-text-field
                        id="margin-top"
                        title="margin-top"
                        tabindex="2"
                        :value="${x => x.uiValues.margin.top}"
                        @change="${(x, c) => x.handleInputChange("margin-top", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-top-right">
                    <button
                        class="layout-button layout-button__active"
                        @click="${(x, c) =>
                            x.handleOpenButtonClick(expandableSection.margin)}"
                    >
                        ${sidesButton}
                    </button>
                </div>
                <div class="item item-left">
                    <dtc-units-text-field
                        id="margin-left"
                        title="margin-left"
                        tabindex="3"
                        :value="${x => x.uiValues.margin.left}"
                        @change="${(x, c) => x.handleInputChange("margin-left", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-right">
                    <dtc-units-text-field
                        id="margin-right"
                        title="margin-right"
                        tabindex="4"
                        :value="${x => x.uiValues.margin.right}"
                        @change="${(x, c) =>
                            x.handleInputChange("margin-right", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-bottom">
                    <dtc-units-text-field
                        id="margin-bottom"
                        title="margin-bottom"
                        tabindex="5"
                        :value="${x => x.uiValues.margin.bottom}"
                        @change="${(x, c) =>
                            x.handleInputChange("margin-bottom", c.event)}"
                    ></dtc-units-text-field>
                </div>
            </div>
        </div>
        <br />
        <div class="section">
            <label for="border" class="section-label">Border Width</label>
            <div
                class="${x =>
                    x.borderOpen ? "single-input single-input__hidden" : "single-input"}"
            >
                <dtc-units-text-field
                    id="border-width"
                    title="border-width"
                    tabindex="6"
                    :value="${x => x.uiValues.borderWidth.getCSSShorthandFourValues()}"
                    @change="${(x, c) => x.handleInputChange("border-width", c.event)}"
                ></dtc-units-text-field>
                <button
                    class="layout-button"
                    @click="${(x, c) =>
                        x.handleOpenButtonClick(expandableSection.border)}"
                >
                    ${sidesButton}
                </button>
            </div>
            <div class="${x => (x.borderOpen ? "grid" : "grid grid__hidden")}">
                <div class="item item-top">
                    <dtc-units-text-field
                        id="border-width-top"
                        title="border-width-top"
                        tabindex="7"
                        :value="${x => x.uiValues.borderWidth.top}"
                        @change="${(x, c) =>
                            x.handleInputChange("border-top-width", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-top-right">
                    <button
                        class="layout-button layout-button__active"
                        @click="${(x, c) =>
                            x.handleOpenButtonClick(expandableSection.border)}"
                    >
                        ${sidesButton}
                    </button>
                </div>
                <div class="item item-left">
                    <dtc-units-text-field
                        id="border-width-left"
                        title="border-width-left"
                        tabindex="8"
                        :value="${x => x.uiValues.borderWidth.left}"
                        @change="${(x, c) =>
                            x.handleInputChange("border-left-width", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-right">
                    <dtc-units-text-field
                        id="border-width-right"
                        title="border-width-right"
                        tabindex="9"
                        :value="${x => x.uiValues.borderWidth.right}"
                        @change="${(x, c) =>
                            x.handleInputChange("border-right-width", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-bottom">
                    <dtc-units-text-field
                        id="border-width-bottom"
                        title="border-width-bottom"
                        tabindex="10"
                        :value="${x => x.uiValues.borderWidth.bottom}"
                        @change="${(x, c) =>
                            x.handleInputChange("border-bottom-width", c.event)}"
                    ></dtc-units-text-field>
                </div>
            </div>
        </div>
        <br />
        <div class="section">
            <label for="padding" class="section-label">Padding</label>
            <div
                class="${x =>
                    x.paddingOpen ? "single-input single-input__hidden" : "single-input"}"
            >
                <dtc-units-text-field
                    id="padding"
                    title="padding"
                    tabindex="11"
                    :value="${x => x.uiValues.padding.getCSSShorthandFourValues()}"
                    @change="${(x, c) => x.handleInputChange("padding", c.event)}"
                ></dtc-units-text-field>
                <button
                    class="layout-button"
                    @click="${(x, c) =>
                        x.handleOpenButtonClick(expandableSection.padding)}"
                >
                    ${sidesButton}
                </button>
            </div>
            <div class="${x => (x.paddingOpen ? "grid" : "grid grid__hidden")}">
                <div class="item item-top">
                    <dtc-units-text-field
                        id="padding-top"
                        title="padding-top"
                        tabindex="12"
                        :value="${x => x.uiValues.padding.top}"
                        @change="${(x, c) => x.handleInputChange("padding-top", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-top-right">
                    <button
                        class="layout-button layout-button__active"
                        @click="${(x, c) =>
                            x.handleOpenButtonClick(expandableSection.padding)}"
                    >
                        ${sidesButton}
                    </button>
                </div>
                <div class="item item-left">
                    <dtc-units-text-field
                        id="padding-left"
                        title="padding-left"
                        tabindex="13"
                        :value="${x => x.uiValues.padding.left}"
                        @change="${(x, c) =>
                            x.handleInputChange("padding-left", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-middle"></div>
                <div class="item item-right">
                    <dtc-units-text-field
                        id="padding-right"
                        title="padding-right"
                        tabindex="14"
                        :value="${x => x.uiValues.padding.right}"
                        @change="${(x, c) =>
                            x.handleInputChange("padding-right", c.event)}"
                    ></dtc-units-text-field>
                </div>
                <div class="item item-bottom">
                    <dtc-units-text-field
                        id="padding-bottom"
                        title="padding-bottom"
                        tabindex="15"
                        :value="${x => x.uiValues.padding.bottom}"
                        @change="${(x, c) =>
                            x.handleInputChange("padding-bottom", c.event)}"
                    ></dtc-units-text-field>
                </div>
            </div>
        </div>
        <br />
        <div class="section">
            <div class="grid grid-dimension">
                <div class="item">
                    <div class="dimension">
                        <label for="width" class="section-label">Width</label>
                        <br />
                        <dtc-units-text-field
                            id="width"
                            title="width"
                            tabindex="16"
                            :value="${x => x.uiValues.width}"
                            @change="${(x, c) => x.handleInputChange("width", c.event)}"
                        ></dtc-units-text-field>
                    </div>
                </div>
                <div class="item">
                    <div class="dimension">
                        <label for="height" class="section-label">Height</label>
                        <br />
                        <dtc-units-text-field
                            id="height"
                            title="height"
                            tabindex="17"
                            :value="${x => x.uiValues.height}"
                            @change="${(x, c) => x.handleInputChange("height", c.event)}"
                        ></dtc-units-text-field>
                    </div>
                </div>
            </div>
        </div>
    </template>
`;
