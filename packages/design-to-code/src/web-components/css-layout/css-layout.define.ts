import { customElement } from "@microsoft/fast-element";
import { cssLayoutTemplate } from "./css-layout.template.js";
import { cssLayoutStyles } from "./css-layout.styles.js";
import { CSSLayout } from "./css-layout.js";

@customElement({
    name: "dtc-css-layout",
    template: cssLayoutTemplate,
    styles: cssLayoutStyles,
})
export class DTCCSSLayout extends CSSLayout {}
