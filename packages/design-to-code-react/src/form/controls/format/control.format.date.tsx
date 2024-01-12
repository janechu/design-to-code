import React, { useEffect } from "react";
import { DateControlProps } from "./control.format.date.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./control.format.date.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function DateControl(props: DateControlProps) {
    function getValue(): string {
        return typeof props.value === "string"
            ? props.value
            : typeof props.default === "string"
            ? props.default
            : "";
    }

    function handleChange(): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.onChange({ value: e.target.value });
        };
    }

    useEffect(() => {
        if (props.validate) {
            props.updateValidity();
            props.reportValidity();
        }
    }, [props.validate]);

    return (
        <span
            className={classNames(
                `dtc-date-control`,
                ["dtc-date-control__disabled", props.disabled],
                [
                    `dtc-date-control__default ${dtcClassName.commonDefaultFont}`,
                    isDefault(props.value, props.default),
                ]
            )}
        >
            <input
                className={classNames(dtcClassName.commonInput)}
                type={"date"}
                value={getValue()}
                onChange={handleChange()}
                disabled={props.disabled}
                ref={props.elementRef as React.MutableRefObject<HTMLInputElement>}
                onBlur={() => props.updateValidity()}
                onFocus={() => props.reportValidity()}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="15"
                viewBox="0 0 24 24"
            >
                <path
                    style={{ fill: "var(--dtc-text-color)" }}
                    d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
                />
            </svg>
        </span>
    );
}

export { DateControl };
export default DateControl;
