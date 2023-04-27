import { keyArrowDown, keyArrowUp } from "@microsoft/fast-web-utilities";
import {
    attr,
    nullableNumberConverter,
    observable,
    Updates,
} from "@microsoft/fast-element";
import { FormAssociatedUnitsTextField } from "./units-text-field.form-associated.js";

export class UnitsTextField extends FormAssociatedUnitsTextField {
    // The word boundry is defined as any whitespace or comma.
    private wordBoundryRegex: RegExp = new RegExp(/[\s,]/g);

    /**
     * A reference to the internal input element
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    protected readOnlyChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
            this.validate();
        }
    }

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;
    protected placeholderChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }

    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    @attr
    public list: string;
    protected listChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.setAttribute("list", this.list);
            this.validate();
        }
    }

    /**
     * The maximum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: maxlength
     */
    @attr({ converter: nullableNumberConverter })
    public maxlength: number;
    protected maxlengthChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.maxLength = this.maxlength;
            this.validate();
        }
    }

    /**
     * The minimum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: minlength
     */
    @attr({ converter: nullableNumberConverter })
    public minlength: number;
    protected minlengthChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.minLength = this.minlength;
            this.validate();
        }
    }

    /**
     * A regular expression that the value must match to pass validation.
     * @public
     * @remarks
     * HTMLAttribute: pattern
     */
    @attr
    public pattern: string;
    protected patternChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.pattern = this.pattern;
            this.validate();
        }
    }

    /**
     * Sets the width of the element to a specified number of characters.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ converter: nullableNumberConverter })
    public size: number;
    protected sizeChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.size = this.size;
        }
    }

    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ mode: "boolean" })
    public spellcheck: boolean;
    protected spellcheckChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.control.addEventListener("keydown", this.handleKeyDown);
    }

    /**
     * Finds the first index of a regular expression in a string.
     * @param searchString The string to search.
     * @param regex The regular expression to match.
     * @param position An optional starting position.
     * @returns The first matching index within the string or -1 if it is not found.
     */
    public indexOf(searchString: string, regex: RegExp, position?: number) {
        const str = position ? searchString.substring(position) : searchString;
        const match = str.match(regex);
        return match ? str.indexOf(match[0]) + position : -1;
    }

    /**
     * Finds the last index of a regular expression in a string.
     * @param searchString The string to search.
     * @param regex The regular expression to match.
     * @param position An optional starting position.
     * @returns The last matching index within the string or -1 if it is not found.
     */
    public lastIndexOf(searchString: string, regex: RegExp, position?: number) {
        const str = position ? searchString.substring(0, position) : searchString;
        const match = str.match(regex);
        return match ? str.lastIndexOf(match[match.length - 1]) : -1;
    }

    public handleKeyDown = (ev: KeyboardEvent): boolean => {
        if (ev.key === keyArrowUp || ev.key === keyArrowDown) {
            const step: number =
                (ev.shiftKey ? 10 : 1) * (ev.key === keyArrowUp ? 1 : -1);
            const startPosition: number = this.control.selectionStart;
            const endPosition: number = this.control.selectionEnd;
            const originalValue: string = this.control.value;
            const isSelected: boolean = startPosition !== endPosition;

            let replaceText: string = "";

            // Find the "word" closest to the cursor or selected area
            // startPosition is the cursor location and startPosition === endPosition when nothing is selected

            // Find the last index of a non-alphanumeric character, dot or minus before the start position
            const startIndex =
                startPosition > 0
                    ? this.lastIndexOf(
                          originalValue,
                          this.wordBoundryRegex,
                          startPosition
                      ) + 1
                    : 0;
            // Find the first index of a non-alphanumeric character, dot or minus after the start position
            let endIndex = this.indexOf(
                originalValue,
                this.wordBoundryRegex,
                startPosition
            );

            // Set end index to end of string if no matches
            endIndex = endIndex < 0 ? originalValue.length : endIndex;

            // Get the substring that we are acting on
            replaceText = originalValue.substring(startIndex, endIndex);

            // Parse the substring into a number ignoring leading non-numeric characters
            const originalNumber = parseInt(replaceText.replace(/^[^\d-]*/, ""), 10);

            // Adjust the value
            const newNum = originalNumber + step;

            // Replace the original text with the new number value
            const newValue =
                originalValue.substring(0, startIndex) +
                originalValue
                    .substring(startIndex)
                    .replace(originalNumber.toString(), newNum.toString());

            // If no change (likely because there was no numeric value present) do nothing
            if (newValue !== originalValue) {
                // Set the control to the new value
                this.value = newValue;

                Updates.enqueue(() => {
                    // Update the selected range to match the length of the new number
                    this.control.setSelectionRange(
                        isSelected ? startIndex : startPosition,
                        isSelected
                            ? endIndex +
                                  newNum.toString().length -
                                  originalNumber.toString().length
                            : startPosition
                    );
                });

                this.$emit("change");
            }

            // Prevent the default otherwise up and down arrow moves the cursor to the beginning or end of the text
            ev.preventDefault();
            return false;
        }
    };

    public handleTextInput() {
        this.value = this.control.value;
        // override base class handleTextInput so we can emit a change event with every keypress and not just when it loses focus
        this.$emit("change");
    }

    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    public handleChange(): void {
        this.$emit("change");
    }

    /** {@inheritDoc (FormAssociated:interface).validate} */
    public validate(): void {
        super.validate(this.control);
    }
}
