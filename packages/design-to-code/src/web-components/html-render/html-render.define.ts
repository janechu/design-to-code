import { htmlRenderTemplate } from "./html-render.template.js";
import { htmlRenderStyles } from "./html-render.styles.js";
import { HTMLRender } from "./html-render.js";

HTMLRender.define({
    name: "dtc-html-render",
    template: htmlRenderTemplate,
    styles: htmlRenderStyles,
});
