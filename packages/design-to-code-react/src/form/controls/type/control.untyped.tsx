import React, { useEffect, useState } from "react";
import { UntypedControlProps } from "./control.untyped.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import style from "./control.untyped.style.css";
import { DataType } from "design-to-code";

// tree-shaking
cssVariables;
style;

/**
 * Form control definition
 */
function UntypedControl(props: UntypedControlProps) {
    const [focused, setFocus] = useState(false);
    const [detectedType, setDetectedType] = useState(getType());

    useEffect(() => {
        setDetectedType(getType());
    }, [props.value]);

    function getType(): DataType {
        const typeofValue = typeof props.value;
        return Array.isArray(props.value)
            ? DataType.array
            : props.value === null
            ? DataType.null
            : typeofValue === "boolean"
            ? DataType.boolean
            : typeofValue === "undefined"
            ? DataType.unknown
            : typeofValue === "string"
            ? DataType.string
            : typeofValue === "number"
            ? DataType.number
            : DataType.object;
    }

    function getRows(): number {
        return typeof props.rows === "number" ? props.rows : 3;
    }

    function getValue(): string {
        // Return undefined to allow typing anywhere other than the end of the string
        // when the typing is occuring in the textarea
        if (focused) {
            return;
        }

        return typeof props.value !== "undefined"
            ? JSON.stringify(props.value, null, 2)
            : typeof props.default !== "undefined"
            ? JSON.stringify(props.default, null, 2)
            : undefined;
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
            const value = e.target.value;

            try {
                const parsedValue = JSON.parse(value);
                props.onChange({ value: parsedValue });
            } catch (e) {
                props.onChange({ value });
            }
        };
    }

    return (
        <div
            className={classNames(
                "dtc-untyped-control",
                ["dtc-untyped-control__disabled", props.disabled],
                ["dtc-untyped-control__default", isDefault(props.value, props.default)]
            )}
        >
            <div className={"detected-type"}>
                Detected type: <code>{detectedType}</code>
            </div>
            <textarea
                id={props.dataLocation}
                name={props.dataLocation}
                rows={getRows()}
                value={getValue()}
                onChange={handleChange()}
                disabled={props.disabled}
                ref={props.elementRef as React.MutableRefObject<HTMLTextAreaElement>}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
}

export { UntypedControl };
export default UntypedControl;
