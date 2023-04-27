import { FormAssociated } from "../form-associated/form-associated.js";
import { FASTElement } from "@microsoft/fast-element";

class _File extends FASTElement {}
interface _File extends FormAssociated {}

/**
 * A form-associated base class for the {@link design-to-code#(File:class)} component.
 *
 * @internal
 */
export class FormAssociatedFile extends FormAssociated(_File) {
    proxy: HTMLInputElement = (() => {
        const proxy = document.createElement("input");
        proxy.setAttribute("type", "file");
        return proxy;
    })();
}
