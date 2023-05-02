import { html, ref } from "@microsoft/fast-element";
import dtcClassName from "../../../style/class-names.js";
import { StandardFrame } from "./frame.standard.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<StandardFrame>`
    <div
        class="dtc-standard-control-template dtc-common-control-wrapper${x =>
            x.disabled
                ? ` dtc-standard-control-template__disabled ${dtcClassName.commonFormControlDisabled}`
                : ""}"
    >
        <div
            class="dtc-standard-control-template_control-region ${dtcClassName.commonControlRegion}"
        >
            <div
                class="dtc-standard-control-template_control-label-region ${dtcClassName.commonLabelRegion}"
                ${ref("div")}
            >
                <label
                    class="dtc-standard-control-template_control-label ${dtcClassName.commonLabel}"
                >
                    ${x => x.label}
                </label>
            </div>
        </div>
    </div>
`;
