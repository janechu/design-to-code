import React from "react";
import { DisplayControlProps } from "./control.display.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
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
                `dtc-display-control ${dtcClassName.commonInput}`,
                ["dtc-display-control__disabled", props.disabled],
                [
                    `dtc-display-control__default ${dtcClassName.commonDefaultFont}`,
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
        />
    );
}

export { DisplayControl };
export default DisplayControl;
