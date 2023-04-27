import { FormAssociated } from "../form-associated/form-associated.js";
import { FASTElementWithARIAGlobalStatesAndProperties } from "../utilities/aria.js";

class _UnitsTextField extends FASTElementWithARIAGlobalStatesAndProperties {}
interface _UnitsTextField extends FormAssociated {}

/**
 * A form-associated base class for the {@link design-to-code#(UnitsTextField:class)} component.
 *
 * @internal
 */
export class FormAssociatedUnitsTextField extends FormAssociated(_UnitsTextField) {
    proxy: HTMLInputElement = (() => {
        const proxy = document.createElement("input");
        proxy.setAttribute("type", "text");
        return proxy;
    })();
}
