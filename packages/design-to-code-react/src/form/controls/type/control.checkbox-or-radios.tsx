import React, { useEffect, useRef } from "react";
import { CheckboxControlProps } from "./control.checkbox-or-radios.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "../utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import style from "./control.checkbox-or-radios.style.css";
import { uniqueId } from "lodash-es";

// tree-shaking
cssVariables;
style;

const trueRadioId = `dtc-${uniqueId()}`;
const falseRadioId = `dtc-${uniqueId()}`;

/**
 * Form control definition
 */
function CheckboxOrRadiosControl(props: CheckboxControlProps) {
    const containsDefault: boolean = typeof props.default === "boolean";
    const value: boolean =
        typeof props.value === "boolean"
            ? props.value
            : typeof props.value === "undefined" && containsDefault
            ? props.default
            : false;
    const radioTrueRef = useRef(null);
    const radioFalseRef = useRef(null);

    function handleChange(): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.onChange({
                value:
                    e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value === "false"
                        ? false
                        : true,
            });
        };
    }

    function updateRadioValidity() {
        props.updateValidity([radioTrueRef, radioFalseRef]);
    }

    useEffect(() => {
        if (props.validate && containsDefault) {
            props.updateValidity();
            props.reportValidity();
        } else if (!containsDefault) {
            updateRadioValidity();
        }
    }, [props.validate]);

    useEffect(() => {
        if (!containsDefault) {
            updateRadioValidity();
        }
    }, [props.value]);

    function renderCheckbox() {
        return (
            <div
                className={classNames(
                    "dtc-checkbox-control",
                    ["dtc-checkbox-control__disabled", props.disabled],
                    [
                        "dtc-checkbox-control__default",
                        isDefault(props.value, props.default),
                    ]
                )}
            >
                <input
                    className={"dtc-checkbox-control_input"}
                    id={props.dataLocation}
                    type={"checkbox"}
                    value={value.toString()}
                    onChange={handleChange()}
                    checked={value}
                    disabled={props.disabled}
                    ref={props.elementRef as React.Ref<HTMLInputElement>}
                    onFocus={() => props.reportValidity()}
                    onBlur={() => props.updateValidity()}
                />
                <span className={"dtc-checkbox-control_checkmark"} />
            </div>
        );
    }

    function renderRadios() {
        return (
            <div
                className={classNames(
                    "dtc-radio-control",
                    ["dtc-radio-control__disabled", props.disabled],
                    ["dtc-radio-control__default", isDefault(props.value, props.default)]
                )}
            >
                <label htmlFor={`${props.dataLocation}${trueRadioId}`}>
                    <input
                        className={"dtc-radio-control_input"}
                        id={`${props.dataLocation}${trueRadioId}`}
                        type={"radio"}
                        name={props.dataLocation}
                        value={"true"}
                        onChange={handleChange()}
                        checked={value.toString() === "true"}
                        ref={radioTrueRef}
                        onFocus={() => props.reportValidity()}
                        onBlur={updateRadioValidity}
                        disabled={props.disabled}
                    />
                    True
                </label>
                <label htmlFor={`${props.dataLocation}${falseRadioId}`}>
                    <input
                        className={"dtc-radio-control_input"}
                        id={`${props.dataLocation}${falseRadioId}`}
                        type={"radio"}
                        name={props.dataLocation}
                        value={"false"}
                        onChange={handleChange()}
                        checked={
                            props.invalidMessage !== ""
                                ? false
                                : value.toString() === "false"
                        }
                        ref={radioFalseRef}
                        onFocus={() => props.reportValidity()}
                        onBlur={updateRadioValidity}
                        disabled={props.disabled}
                    />
                    False
                </label>
            </div>
        );
    }

    // An assumption is made that if a default is present,
    // the only reason to change the value is to set the opposite value
    if (containsDefault) {
        return renderCheckbox();
    }

    return renderRadios();
}

export { CheckboxOrRadiosControl };
export default CheckboxOrRadiosControl;
