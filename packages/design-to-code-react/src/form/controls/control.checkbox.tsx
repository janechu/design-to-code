import React from "react";
import { CheckboxControlProps } from "./control.checkbox.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import style from "./control.checkbox.style.css";

// tree-shaking
cssVariables;
style;

/**
 * Form control definition
 */
function CheckboxControl(props: CheckboxControlProps) {
    const value: boolean =
        typeof props.value === "boolean"
            ? props.value
            : typeof props.default === "boolean"
            ? props.default
            : false;

    function handleChange(): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.onChange({ value: e.target.checked });
        };
    }

    return (
        <div
            className={classNames(
                "dtc-checkbox-control",
                ["dtc-checkbox-control__disabled", props.disabled],
                ["dtc-checkbox-control__default", isDefault(props.value, props.default)]
            )}
        >
            <input
                className={"dtc-checkbox-control_input"}
                id={props.dataLocation}
                type={"checkbox"}
                value={value.toString()}
                onChange={handleChange()}
                checked={value}
                disabled={props.disabled}
                ref={props.elementRef as React.Ref<HTMLInputElement>}
                onFocus={props.reportValidity}
                onBlur={props.updateValidity}
            />
            <span className={"dtc-checkbox-control_checkmark"} />
        </div>
    );
}

export { CheckboxControl };
export default CheckboxControl;
