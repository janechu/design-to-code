import React from "react";
import { TextAlignControlProps } from "./control.text-align.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import textAlignStyle from "./control.text-align.style.css";

// tree-shaking
cssVariables;
textAlignStyle;

enum Direction {
    Left = "left",
    Center = "center",
    Right = "right",
    Justify = "justify",
}

/**
 * Custom form control definition
 */
function TextAlignControl(props: TextAlignControlProps) {
    function onChange(value: string): void {
        props.onChange({ value });
    }

    function isChecked(direction: string): boolean {
        return (
            props.value === direction ||
            (typeof props.value === "undefined" && props.default === direction)
        );
    }

    function getInputClassName(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return "dtc-text-align-control_input__left";
            case Direction.Center:
                return "dtc-text-align-control_input__center";
            case Direction.Right:
                return "dtc-text-align-control_input__right";
            case Direction.Justify:
                return "dtc-text-align-control_input__justify";
        }
    }

    function getDirectionLabel(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return props.strings.textAlignLeftLabel;
            case Direction.Center:
                return props.strings.textAlignCenterLabel;
            case Direction.Right:
                return props.strings.textAlignRightLabel;
            case Direction.Justify:
                return props.strings.textAlignJustifyLabel;
        }
    }

    function renderInput(direction: Direction): React.ReactNode {
        if (props.options && Array.isArray(props.options)) {
            const option: string = props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                `dtc-text-align-control_input ${dtcClassName.commonInputBackplate}`,
                                getInputClassName(direction)
                            )}
                            id={props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={props.dataLocation}
                            aria-label={getDirectionLabel(direction)}
                            onChange={onChange.bind(this, direction)}
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
            className={classNames("dtc-text-align-control", [
                "dtc-text-align-control__disabled",
                props.disabled,
            ])}
        >
            {renderInput(Direction.Left)}
            {renderInput(Direction.Center)}
            {renderInput(Direction.Right)}
            {renderInput(Direction.Justify)}
        </div>
    );
}

export { TextAlignControl };
export default TextAlignControl;
