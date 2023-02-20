import { customElement } from "@microsoft/fast-element";
import { htmlRenderLayerNavigationTemplate } from "./html-render-layer-navigation.template.js";
import { htmlRenderLayerNavigationStyles } from "./html-render-layer-navigation.style.js";
import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation.js";

@customElement({
    name: "dtc-html-render-layer-navigation",
    template: htmlRenderLayerNavigationTemplate,
    styles: htmlRenderLayerNavigationStyles,
})
export class DTCHTMLRenderLayerNavigation extends HTMLRenderLayerNavigation {}
