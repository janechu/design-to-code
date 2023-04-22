import { html } from "@microsoft/fast-element";
import { BareFrame } from "./frame.bare.js";

/**
 * The template for the form component.
 * @public
 */
export const template = html<BareFrame>`
    <div
        class="dtc-bare-control-template${x =>
            x.disabled ? " dtc-bare-control-template__disabled" : ""}"
    >
        <slot></slot>
    </div>
`;
