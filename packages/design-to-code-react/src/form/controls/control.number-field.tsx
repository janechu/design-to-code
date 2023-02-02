import React from "react";
import { NumberFieldControlProps } from "./control.number-field.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import inputStyle from "../../style/input-style.css";
import defaultFontStyle from "../../style/default-font-style.css";
import style from "./control.number-field.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
class NumberFieldControl extends React.Component<NumberFieldControlProps, {}> {
    public static displayName: string = "NumberFieldControl";

    private hasFocus: boolean = false;

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <input
                className={classNames(
                    "dtc-number-field-control dtc-common-input",
                    ["dtc-number-field-control__disabled", this.props.disabled],
                    [
                        "dtc-number-field-control__default dtc-common-default-font",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                type={"number"}
                value={this.getValue(this.props.value)}
                name={this.props.dataLocation}
                onChange={this.handleChange()}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                disabled={this.props.disabled}
                ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                onBlur={this.handleBlur(this.props.updateValidity)}
                onFocus={this.handleFocus(this.props.reportValidity)}
                required={this.props.required}
            />
        );
    }

    private handleFocus = (callback: () => void) => {
        return (): void => {
            this.hasFocus = true;
            if (callback) callback();
        };
    };

    private handleBlur = (callback: () => void) => {
        return (): void => {
            this.hasFocus = false;
            if (callback) callback();
            this.forceUpdate();
        };
    };

    private handleChange = (): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const input: string = !e.target.value
                ? ""
                : e.target.value.replace(/\s/g, "");
            const value: number = parseInt(input, 10);

            if (!isNaN(value)) {
                this.props.onChange({ value });
            } else if (input.length === 0) {
                this.props.onChange({ value: undefined });
            }
        };
    };

    private getValue(value: number | undefined): number | string {
        return typeof value === "number"
            ? value
            : typeof this.props.default !== "undefined" && !this.hasFocus
            ? this.props.default
            : "";
    }
}

export { NumberFieldControl };
export default NumberFieldControl;
