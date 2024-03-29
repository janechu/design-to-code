import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _BoxModel extends FASTElement {}
interface _BoxModel extends FormAssociated {}

/**
 * A form-associated base class for the boxModel component.
 *
 * @internal
 */
export class FormAssociatedCSSBoxModel extends FormAssociated(_BoxModel) {
    public proxy: HTMLInputElement = document.createElement("input");
}
