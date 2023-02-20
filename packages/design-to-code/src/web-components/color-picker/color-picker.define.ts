import { customElement } from "@microsoft/fast-element";
import { colorPickerTemplate } from "./color-picker.template.js";
import { colorPickerStyles } from "./color-picker.styles.js";
import { ColorPicker } from "./color-picker.js";

@customElement({
    name: "dtc-color-picker",
    template: colorPickerTemplate,
    styles: colorPickerStyles,
})
export class DTCColorPicker extends ColorPicker {}
