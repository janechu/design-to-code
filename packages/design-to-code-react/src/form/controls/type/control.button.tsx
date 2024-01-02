import React from "react";
import { ButtonControlProps } from "./control.button.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./control.button.style.css";

// tree-shaking
cssVariables;
inputStyle;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function ButtonControl(props: ButtonControlProps & React.PropsWithChildren) {
    function handleButtonClick(): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            props.onChange({ value: null });
        };
    }

    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    function handleInputChange(): void {}

    return (
        <React.Fragment>
            <button
                className={classNames(
                    `dtc-button-control ${dtcClassName.commonInput}`,
                    ["dtc-button-control__disabled", props.disabled],
                    [
                        `dtc-button-control__default ${dtcClassName.commonDefaultFont}`,
                        isDefault(props.value, props.default),
                    ]
                )}
                ref={props.elementRef as React.Ref<HTMLButtonElement>}
                onBlur={props.updateValidity}
                onFocus={props.reportValidity}
                onClick={handleButtonClick()}
                disabled={props.disabled}
            >
                Set to null
            </button>
            <input
                id={props.dataLocation}
                hidden={true}
                value={props.value || ""}
                onChange={handleInputChange}
                disabled={props.disabled}
            />
        </React.Fragment>
    );
}

export { ButtonControl };
export default ButtonControl;
