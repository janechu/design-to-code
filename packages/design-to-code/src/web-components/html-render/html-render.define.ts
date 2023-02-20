import { customElement } from "@microsoft/fast-element";
import { htmlRenderTemplate } from "./html-render.template.js";
import { htmlRenderStyles } from "./html-render.styles.js";
import { HTMLRender } from "./html-render.js";

@customElement({
    name: "dtc-html-render",
    template: htmlRenderTemplate,
    styles: htmlRenderStyles,
})
export class DTCHTMLRender extends HTMLRender {}
