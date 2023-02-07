import React from "react";
import { DisplayControlProps } from "./control.display.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import inputStyle from "../../style/input-style.css";
import defaultFontStyle from "../../style/default-font-style.css";
import style from "./control.display.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function DisplayControl(props: DisplayControlProps) {
    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    function handleInputChange(): void {}

    function getDisplayValue(data: any): string {
        const typeofData: string = typeof data;
        const typeofDefault: string = typeof props.default;

        if (typeofData === "undefined" && typeofDefault !== "undefined") {
            if (typeofDefault === "string") {
                return props.default;
            }

            return JSON.stringify(props.default, null, 2);
        }

        switch (typeofData) {
            case "string":
                return data;
            default:
                return JSON.stringify(data, null, 2);
        }
    }

    return (
        <input
            className={classNames(
                "dtc-display-control dtc-common-input",
                ["dtc-display-control__disabled", props.disabled],
                [
                    "dtc-display-control__default dtc-common-default-font",
                    isDefault(props.value, props.default),
                ]
            )}
            type={"text"}
            ref={props.elementRef as React.Ref<HTMLInputElement>}
            onBlur={props.updateValidity}
            onFocus={props.reportValidity}
            value={getDisplayValue(props.value)}
            onChange={handleInputChange}
            disabled={props.disabled}
            required={props.required}
        />
    );
}

export { DisplayControl };
export default DisplayControl;
