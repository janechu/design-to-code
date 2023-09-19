import React from "react";
import { SelectControlProps } from "./control.select.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import selectSpanStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-span.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import selectInputStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-input.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
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
function SelectControl(props: SelectControlProps) {
    function handleChange(): (e: React.ChangeEvent<HTMLSelectElement>) => void {
        return (e: React.ChangeEvent<HTMLSelectElement>): void => {
            const value: any = props.options.find((option: any): any => {
                return typeof option === "string"
                    ? option === e.target.value
                    : JSON.stringify(option) === e.target.value;
            });
            props.onChange({ value });
        };
    }

    /**
     * Stringify the select value
     */
    function stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    function getValue(): any {
        return typeof props.value !== "undefined"
            ? props.value
            : typeof props.default !== "undefined"
            ? props.default
            : "";
    }

    /**
     * Renders the selects option elements
     */
    function renderOptions(): React.ReactNode {
        return (props.options || []).map((item: any, index: number) => {
            return (
                <option key={index} value={item}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : stringify(item)}
                </option>
            );
        });
    }

    return (
        <span
            className={classNames(
                `dtc-select-control ${dtcClassName.commonSelectSpan}`,
                ["dtc-select-control__disabled", props.disabled],
                [
                    `dtc-select-control__default ${dtcClassName.commonDefaultFont}`,
                    isDefault(props.value, props.default),
                ]
            )}
        >
            <select
                className={`dtc-select-control_input ${dtcClassName.commonSelectInput}`}
                onChange={handleChange()}
                value={getValue()}
                disabled={props.disabled}
                ref={props.elementRef as React.Ref<HTMLSelectElement>}
                onBlur={props.updateValidity}
                onFocus={props.reportValidity}
            >
                {renderOptions()}
            </select>
        </span>
    );
}

export { SelectControl };
export default SelectControl;
