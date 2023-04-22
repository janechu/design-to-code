import { html } from "@microsoft/fast-element";
import { format } from "@microsoft/fast-web-utilities";
import dtcClassName from "../../../style/class-names.js";
import { SectionLinkControl } from "./control.section-link.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<SectionLinkControl>`
    <a
        class="dtc-section-link-control${x =>
            x.disabled ? " dtc-section-link-control__disabled" : ""}${x =>
            x.invalidMessage !== "" ? " dtc-section-link-control__invalid" : ""}${x =>
            x.value === x.default
                ? ` dtc-section-link-control__default ${dtcClassName.commonDefaultFont}`
                : ""}"
        @click="${x => x.handleUpdateSection}"
    >
        ${x => format(x.strings.sectionLinkEditLabel, x.label)}
    </a>
`;
