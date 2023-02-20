import { customElement } from "@microsoft/fast-element";
import { htmlRenderLayerInlineEditTemplate } from "./html-render-layer-inline-edit.template.js";
import { htmlRenderLayerInlineEditStyles } from "./html-render-layer-inline-edit.style.js";
import { HTMLRenderLayerInlineEdit } from "./html-render-layer-inline-edit.js";

@customElement({
    name: "dtc-html-render-layer-inline-edit",
    template: htmlRenderLayerInlineEditTemplate,
    styles: htmlRenderLayerInlineEditStyles,
})
export class DTCHTMLRenderLayerInlineEdit extends HTMLRenderLayerInlineEdit {}
