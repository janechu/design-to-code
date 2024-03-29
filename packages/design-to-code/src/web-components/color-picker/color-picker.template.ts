import { html, ref } from "@microsoft/fast-element";
import dtcClassName from "../style/class-names.js";
import type { ColorPicker } from "./color-picker.js";

/**
 * The template for the color picker component.
 * @public
 */
export const colorPickerTemplate = html<ColorPicker>`
    <template
        @focus="${x => x.handleFocus()}"
        @blur="${x => x.handleBlur()}"
        @mousemove="${(x, c) =>
            x.mouseActive ? x.handleMouseMove(c.event as MouseEvent) : null}"
        @mouseup="${(x, c) =>
            x.mouseActive ? x.handleMouseUp(c.event as MouseEvent) : null}"
    >
        <div
            class="root"
            part="root"
            style="--selected-color-value: ${x => (x.value ? x.value : "transparent")}"
        >
            <link
                rel="stylesheet"
                type="text/css"
                href="${x => x.commonDefaultFontStylesheet}"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="${x => x.commonInputStylesheet}"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="${x => x.controlTextFieldStylesheet}"
            />
            <div class="content">
                <div
                    class="${x =>
                        x.disabled
                            ? `${dtcClassName.controlTextField} ${dtcClassName.controlTextField__disabled}`
                            : dtcClassName.controlTextField}"
                >
                    <div class="control-color"></div>
                    <input
                        class="root-control ${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                        part="control"
                        id="control"
                        type="text"
                        @input="${x => x.handleTextInput()}"
                        @change="${x => x.handleChange()}"
                        ?autofocus="${x => x.autofocus}"
                        ?disabled="${x => x.disabled}"
                        placeholder="${x => x.placeholder}"
                        ?readonly="${x => x.readOnly}"
                        ?required="${x => x.required}"
                        :value="${x => x.value}"
                        ${ref("control")}
                    />
                </div>
            </div>
            <div class="${x => (x.open ? "popup popup__open" : "popup")}">
                <div class="pickers">
                    <div
                        class="pickers-saturation"
                        style="background-color:${x => x.uiValues.HueCSSColor}"
                        @mousedown="${(x, c) =>
                            x.handleMouseDown("sv", c.event as MouseEvent)}"
                    >
                        <div
                            class="saturation-indicator"
                            style="left: ${x =>
                                x.uiValues.SatValLeftPos - 2}%; top: ${x =>
                                x.uiValues.SatValTopPos - 2}%"
                        ></div>
                    </div>
                    <div
                        class="pickers-hue"
                        @mousedown="${(x, c) =>
                            x.handleMouseDown("h", c.event as MouseEvent)}"
                    >
                        <div
                            class="hue-indicator"
                            style="left: ${x => x.uiValues.HuePosition - 1}%"
                        ></div>
                    </div>
                    <div
                        class="pickers-alpha"
                        @mousedown="${(x, c) =>
                            x.handleMouseDown("a", c.event as MouseEvent)}"
                    >
                        <div
                            class="alpha-mask"
                            style="background-image: linear-gradient(to right, transparent, ${x =>
                                x.uiValues.HueCSSColor})"
                        ></div>
                        <div
                            class="alpha-indicator"
                            style="left: ${x => x.uiValues.AlphaPos - 1}%"
                        ></div>
                    </div>
                </div>
                <div class="inputs">
                    <div class="${dtcClassName.controlTextField}">
                        <span>R:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("r", c.event)}"
                            :value="${x => Math.round(x.uiValues.RGBColor.r * 255)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>G:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("g", c.event)}"
                            :value="${x => Math.round(x.uiValues.RGBColor.g * 255)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>B:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("b", c.event)}"
                            :value="${x => Math.round(x.uiValues.RGBColor.b * 255)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>H:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("h", c.event)}"
                            :value="${x => Math.round(x.uiValues.HSVColor.h)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>S:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("s", c.event)}"
                            :value="${x => Math.round(x.uiValues.HSVColor.s * 100)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>V:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("v", c.event)}"
                            :value="${x => Math.round(x.uiValues.HSVColor.v * 100)}"
                        />
                    </div>
                    <div class="${dtcClassName.controlTextField}">
                        <span>A:</span>
                        <input
                            type="text"
                            class="${dtcClassName.commonDefaultFont} ${dtcClassName.commonInput}"
                            maxlength="3"
                            size="3"
                            @input="${(x, c) => x.handleTextValueInput("a", c.event)}"
                            :value="${x => Math.round(x.uiValues.RGBColor.a * 100)}"
                        />
                    </div>
                </div>
            </div>
        </div>
    </template>
`;
