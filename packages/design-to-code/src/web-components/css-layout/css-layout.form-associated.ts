import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _CSSLayout extends FASTElement {}
interface _CSSLayout extends FormAssociated {}

/**
 * A form-associated base class for the flexbox component.
 *
 * @internal
 */
export class FormAssociatedCSSLayout extends FormAssociated(_CSSLayout) {
    proxy: HTMLInputElement = document.createElement("input");
}
