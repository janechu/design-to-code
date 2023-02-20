import { customElement } from "@microsoft/fast-element";
import { unitsTextFieldTemplate } from "./units-text-field.template.js";
import { unitsTextFieldStyles } from "./units-text-field.styles.js";
import { UnitsTextField } from "./units-text-field.js";

@customElement({
    name: "dtc-units-text-field",
    template: unitsTextFieldTemplate,
    styles: unitsTextFieldStyles,
})
export class DTCUnitsTextField extends UnitsTextField {}
