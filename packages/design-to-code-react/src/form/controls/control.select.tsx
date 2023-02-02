import React from "react";
import { SelectControlProps } from "./control.select.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import selectSpanStyle from "../../style/select-span-style.css";
import defaultFontStyle from "../../style/default-font-style.css";
import selectInputStyle from "../../style/select-input-style.css";
import style from "./control.select.style.css";

// tree-shaking
cssVariables;
selectSpanStyle;
defaultFontStyle;
selectInputStyle;
style;

/**
 * Form control definition
 */
class SelectControl extends React.Component<SelectControlProps, {}> {
    public static displayName: string = "SelectControl";

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <span
                className={classNames(
                    "dtc-select-control dtc-common-select-span",
                    ["dtc-select-control__disabled", this.props.disabled],
                    [
                        "dtc-select-control__default dtc-common-default-font",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
            >
                <select
                    className={"dtc-select-control_input dtc-common-select-input"}
                    onChange={this.handleChange()}
                    value={this.getValue()}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef as React.Ref<HTMLSelectElement>}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    required={this.props.required}
                >
                    {this.renderOptions()}
                </select>
            </span>
        );
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLSelectElement>) => void) => {
        return (e: React.ChangeEvent<HTMLSelectElement>): void => {
            const value: any = this.props.options.find((option: any): any => {
                return typeof option === "string"
                    ? option === e.target.value
                    : JSON.stringify(option) === e.target.value;
            });
            this.props.onChange({ value });
        };
    };

    /**
     * Stringify the select value
     */
    private stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    private getValue(): any {
        return typeof this.props.value !== "undefined"
            ? this.props.value
            : typeof this.props.default !== "undefined"
            ? this.props.default
            : "";
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): React.ReactNode {
        return (this.props.options || []).map((item: any, index: number) => {
            return (
                <option key={index} value={item}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : this.stringify(item)}
                </option>
            );
        });
    }
}

export { SelectControl };
export default SelectControl;
