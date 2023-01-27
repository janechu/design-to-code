import React from "react";
import { CheckboxControlProps } from "./control.checkbox.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import style from "./control.checkbox.style.css";

// tree-shaking
cssVariables;
style;

/**
 * Form control definition
 * @extends React.Component
 */
class CheckboxControl extends React.Component<CheckboxControlProps, {}> {
    public static displayName: string = "CheckboxControl";

    public render(): JSX.Element {
        const value: boolean =
            typeof this.props.value === "boolean"
                ? this.props.value
                : typeof this.props.default === "boolean"
                ? this.props.default
                : false;

        return (
            <div
                className={classNames(
                    "dtc-checkbox-control",
                    ["dtc-checkbox-control__disabled", this.props.disabled],
                    [
                        "dtc-checkbox-control__default",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
            >
                <input
                    className={"dtc-checkbox-control_input"}
                    id={this.props.dataLocation}
                    type={"checkbox"}
                    value={value.toString()}
                    onChange={this.handleChange()}
                    checked={value}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                />
                <span className={"dtc-checkbox-control_checkmark"} />
            </div>
        );
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.props.onChange({ value: e.target.checked });
        };
    };
}

export { CheckboxControl };
export default CheckboxControl;
