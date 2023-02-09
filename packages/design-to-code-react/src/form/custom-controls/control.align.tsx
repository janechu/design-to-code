import React from "react";
import { AlignControlProps, Alignment } from "./control.align.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
import alignStyle from "./control.align.style.css";

// tree-shaking
cssVariables;
alignStyle;

/**
 * Custom form control definition
 */
function AlignControl(props: AlignControlProps) {
    function isChecked(direction: string): boolean {
        return (
            props.value === direction ||
            (typeof props.value === "undefined" && props.default === direction)
        );
    }

    function handleChange(value: string): () => void {
        return (): void => {
            props.onChange({ value });
        };
    }

    function renderInput(direction: Alignment): React.ReactNode {
        if (props.options && Array.isArray(props.options)) {
            const option: string = props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                "dtc-align-control_input dtc-common-input-backplate",
                                [
                                    "dtc-align-control_input__bottom",
                                    direction === Alignment.bottom,
                                ],
                                [
                                    "dtc-align-control_input__center",
                                    direction === Alignment.center,
                                ],
                                [
                                    "dtc-align-control_input__top",
                                    direction === Alignment.top,
                                ]
                            )}
                            id={props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={props.dataLocation}
                            aria-label={`${direction} align`}
                            onChange={handleChange(direction)}
                            checked={isChecked(direction)}
                            disabled={props.disabled}
                        />
                    </span>
                );
            }
        }
    }

    return (
        <div
            className={classNames("dtc-align-control", [
                "dtc-align-control__disabled",
                props.disabled,
            ])}
        >
            {renderInput(Alignment.top)}
            {renderInput(Alignment.center)}
            {renderInput(Alignment.bottom)}
        </div>
    );
}

export { AlignControl };
export default AlignControl;
