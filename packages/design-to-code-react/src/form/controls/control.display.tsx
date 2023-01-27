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
class DisplayControl extends React.Component<DisplayControlProps, {}> {
    public static displayName: string = "DisplayControl";

    public render(): React.ReactNode {
        return (
            <input
                className={classNames(
                    "dtc-display-control dtc-common-input",
                    ["dtc-display-control__disabled", this.props.disabled],
                    [
                        "dtc-display-control__default dtc-common-default-font",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                type={"text"}
                ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                onBlur={this.props.updateValidity}
                onFocus={this.props.reportValidity}
                value={this.getDisplayValue(this.props.value)}
                onChange={this.handleInputChange}
                disabled={this.props.disabled}
                required={this.props.required}
            />
        );
    }

    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    private handleInputChange = (): void => {};

    private getDisplayValue(data: any): string {
        const typeofData: string = typeof data;
        const typeofDefault: string = typeof this.props.default;

        if (typeofData === "undefined" && typeofDefault !== "undefined") {
            if (typeofDefault === "string") {
                return this.props.default;
            }

            return JSON.stringify(this.props.default, null, 2);
        }

        switch (typeofData) {
            case "string":
                return data;
            default:
                return JSON.stringify(data, null, 2);
        }
    }
}

export { DisplayControl };
export default DisplayControl;
