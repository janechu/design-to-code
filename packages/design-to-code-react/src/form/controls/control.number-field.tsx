import React from "react";
import { NumberFieldControlProps } from "./control.number-field.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./control.number-field.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function NumberFieldControl(props: NumberFieldControlProps) {
    let hasFocus: boolean = false;

    function handleFocus(callback: () => void) {
        return (): void => {
            hasFocus = true;
            if (callback) callback();
        };
    }

    function handleBlur(callback: () => void) {
        return (): void => {
            hasFocus = false;
            if (callback) callback();
        };
    }

    function handleChange(): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const input: string = !e.target.value
                ? ""
                : e.target.value.replace(/\s/g, "");
            const value: number = parseInt(input, 10);

            if (!isNaN(value)) {
                props.onChange({ value });
            } else if (input.length === 0) {
                props.onChange({ value: undefined });
            }
        };
    }

    function getValue(value: number | undefined): number | string {
        return typeof value === "number"
            ? value
            : typeof props.default !== "undefined" && !hasFocus
            ? props.default
            : "";
    }

    return (
        <input
            className={classNames(
                `dtc-number-field-control ${dtcClassName.commonInput}`,
                ["dtc-number-field-control__disabled", props.disabled],
                [
                    `dtc-number-field-control__default ${dtcClassName.commonDefaultFont}`,
                    isDefault(props.value, props.default),
                ]
            )}
            id={props.dataLocation}
            type={"number"}
            value={getValue(props.value)}
            name={props.dataLocation}
            onChange={handleChange()}
            min={props.min}
            max={props.max}
            step={props.step}
            disabled={props.disabled}
            ref={props.elementRef as React.Ref<HTMLInputElement>}
            onBlur={handleBlur(props.updateValidity)}
            onFocus={handleFocus(props.reportValidity)}
            required={props.required}
        />
    );
}

export { NumberFieldControl };
export default NumberFieldControl;
