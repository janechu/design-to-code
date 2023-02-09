import {
    CSSPropertyRef,
    CSSPropertySyntax,
    CSSSyntaxRef,
} from "design-to-code/dist/esm/data-utilities/mapping.mdn-data";
import { XOR } from "design-to-code/dist/esm/data-utilities/type.utilities";

export interface CSSRefProps {
    /**
     * If this prop is available then this is the root level
     * CSS property reference, if not it is a partial reference
     * for a CSS property
     */
    mapsToProperty?: string;

    /**
     * The onChange callback to call when a value has been changed by
     * a form element
     */
    onChange: (value: string) => void;

    /**
     * The syntax or reference used to determine the form element UI
     */
    syntax: XOR<CSSPropertySyntax, XOR<CSSPropertyRef, CSSSyntaxRef>>;

    /**
     * The value of the CSS declaration
     */
    value: string;

    /**
     * The current dictionary ID
     */
    dictionaryId: string;

    /**
     * The current data location
     */
    dataLocation: string;
}
