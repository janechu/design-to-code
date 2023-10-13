import { guidanceDocumentTemplate } from "./guidance-document.template.js";
import { guidanceDocumentStyles } from "./guidance-document.styles.js";
import { GuidanceDocument } from "./guidance-document.js";

GuidanceDocument.define({
    name: "dtc-guidance-document",
    template: guidanceDocumentTemplate,
    styles: guidanceDocumentStyles,
});
