import { customElement } from "@microsoft/fast-element";
import { fileTemplate } from "./file.template.js";
import { fileStyles } from "./file.styles.js";
import { File } from "./file.js";

@customElement({
    name: "dtc-file",
    template: fileTemplate,
    styles: fileStyles,
})
export class DTCFile extends File {}
