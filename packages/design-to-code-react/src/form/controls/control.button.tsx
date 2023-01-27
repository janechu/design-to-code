import React from "react";
import { ButtonControlProps } from "./control.button.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import inputStyle from "../../style/input-style.css";
import defaultFontStyle from "../../style/default-font-style.css";
import style from "./control.button.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 * @extends React.Component
 */
class ButtonControl extends React.Component<ButtonControlProps, {}> {
    public static displayName: string = "ButtonControl";

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <button
                    className={classNames(
                        "dtc-button-control dtc-common-input",
                        ["dtc-button-control__disabled", this.props.disabled],
                        [
                            "dtc-button-control__default dtc-common-default-font",
                            isDefault(this.props.value, this.props.default),
                        ]
                    )}
                    ref={this.props.elementRef as React.Ref<HTMLButtonElement>}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    onClick={this.handleButtonClick()}
                    disabled={this.props.disabled}
                >
                    Set to null
                </button>
                <input
                    id={this.props.dataLocation}
                    hidden={true}
                    value={this.props.value || ""}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                    required={this.props.required}
                />
            </React.Fragment>
        );
    }

    private handleButtonClick = (): ((
        e: React.MouseEvent<HTMLButtonElement>
    ) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            this.props.onChange({ value: null });
        };
    };

    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    private handleInputChange = (): void => {};
}

export { ButtonControl };
export default ButtonControl;
