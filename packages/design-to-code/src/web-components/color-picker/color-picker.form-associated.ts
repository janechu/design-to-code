import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _ColorPicker extends FASTElement {}
interface _ColorPicker extends FormAssociated {}

/**
 * A form-associated base class for the {@link design-to-code#(ColorPicker:class)} component.
 *
 * @internal
 */
export class FormAssociatedColorPicker extends FormAssociated(_ColorPicker) {
    proxy: HTMLInputElement = document.createElement("input");
}
