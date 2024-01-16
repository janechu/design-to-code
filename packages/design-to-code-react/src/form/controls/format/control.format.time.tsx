import React, { useEffect } from "react";
import { TimeControlProps } from "./control.format.time.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./control.format.time.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function TimeControl(props: TimeControlProps) {
    function getValue(): string {
        return typeof props.value === "string"
            ? props.value
            : typeof props.default === "string"
            ? props.default
            : "";
    }

    function handleChange(): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            // The time input type only includes hours and minutes, however
            // JSON schema time format requires the seconds, so this control
            // always adds in 00 seconds
            props.onChange({ value: `${e.target.value}:00` });
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
                `dtc-time-control`,
                ["dtc-time-control__disabled", props.disabled],
                [
                    `dtc-time-control__default ${dtcClassName.commonDefaultFont}`,
                    isDefault(props.value, props.default),
                ]
            )}
        >
            <input
                className={classNames(dtcClassName.commonInput)}
                type={"time"}
                value={getValue()}
                onChange={handleChange()}
                disabled={props.disabled}
                ref={props.elementRef as React.MutableRefObject<HTMLInputElement>}
                onBlur={() => props.updateValidity()}
                onFocus={() => props.reportValidity()}
            />
            {/* !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc. */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
            >
                <path
                    style={{ fill: "var(--dtc-text-color)" }}
                    d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                />
            </svg>
        </span>
    );
}

export { TimeControl };
export default TimeControl;
