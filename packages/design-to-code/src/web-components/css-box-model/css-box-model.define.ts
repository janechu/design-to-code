import { customElement } from "@microsoft/fast-element";
import { cssBoxModelTemplate } from "./css-box-model.template.js";
import { cssBoxModelStyles } from "./css-box-model.styles.js";
import { CSSBoxModel } from "./css-box-model.js";

@customElement({
    name: "dtc-css-box-model",
    template: cssBoxModelTemplate,
    styles: cssBoxModelStyles,
})
export class DTCCSSBoxModel extends CSSBoxModel {}
