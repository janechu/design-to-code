import React from "react";
import { EmailControlProps } from "./control.format.email.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./control.format.email.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function EmailControl(props: EmailControlProps) {
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

    return (
        <input
            className={classNames(
                `dtc-email-control ${dtcClassName.commonInput}`,
                ["dtc-email-control__disabled", props.disabled],
                [
                    `dtc-email-control__default ${dtcClassName.commonDefaultFont}`,
                    isDefault(props.value, props.default),
                ]
            )}
            type={"email"}
            value={getValue()}
            onChange={handleChange()}
            disabled={props.disabled}
            ref={props.elementRef as React.MutableRefObject<HTMLInputElement>}
            onBlur={props.updateValidity}
            onFocus={props.reportValidity}
        />
    );
}

export { EmailControl };
export default EmailControl;
