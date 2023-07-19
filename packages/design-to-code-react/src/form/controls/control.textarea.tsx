import React, { useState } from "react";
import { TextareaControlProps } from "./control.textarea.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import style from "./control.textarea.style.css";

// tree-shaking
cssVariables;
style;

/**
 * Form control definition
 */
function TextareaControl(props: TextareaControlProps) {
    const [focused, setFocus] = useState(false);

    function getRows(): number {
        return typeof props.rows === "number" ? props.rows : 3;
    }

    function getValue(): string {
        // Return undefined to allow typing anywhere other than the end of the string
        // when the typing is occuring in the textarea
        if (focused) {
            return;
        }

        return typeof props.value === "string"
            ? props.value
            : typeof props.default === "string"
            ? props.default
            : "";
    }

    function handleFocus(e: React.FocusEvent<HTMLTextAreaElement>): void {
        props.reportValidity();

        setFocus(true);
    }

    function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>): void {
        props.updateValidity();

        setFocus(false);
    }

    function handleChange(): (e: React.ChangeEvent<HTMLTextAreaElement>) => void {
        return (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            props.onChange({ value: e.target.value });
        };
    }

    return (
        <textarea
            className={classNames(
                "dtc-textarea-control",
                ["dtc-textarea-control__disabled", props.disabled],
                ["dtc-textarea-control__default", isDefault(props.value, props.default)]
            )}
            id={props.dataLocation}
            name={props.dataLocation}
            rows={getRows()}
            value={getValue()}
            onChange={handleChange()}
            disabled={props.disabled}
            ref={props.elementRef as React.MutableRefObject<HTMLTextAreaElement>}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={props.required}
        />
    );
}

export { TextareaControl };
export default TextareaControl;
