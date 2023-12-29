/**
 * DO NOT EDIT - generated from /build/guidance.js
 */
import { css } from "@microsoft/fast-element";
import * as Guidance from "../guidance/guidance.define.js";
import * as GuidanceDocument from "../guidance-document/guidance-document.define.js";
import { formGuidanceTemplate } from "./form-guidance.template.js";
import { FormGuidance } from "./form-guidance.js";

// tree-shaking
Guidance;
GuidanceDocument;

FormGuidance.define({
    name: "dtc-form-guidance",
    template: formGuidanceTemplate,
    styles: css``,
});
