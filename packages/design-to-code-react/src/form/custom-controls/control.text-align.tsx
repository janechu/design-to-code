import React from "react";
import { TextAlignControlProps } from "./control.text-align.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
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
class TextAlignControl extends React.Component<TextAlignControlProps, {}> {
    public static displayName: string = "TextAlignControl";

    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-text-align-control", [
                    "dtc-text-align-control__disabled",
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Direction.Left)}
                {this.renderInput(Direction.Center)}
                {this.renderInput(Direction.Right)}
                {this.renderInput(Direction.Justify)}
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange({ value });
    };

    private isChecked(direction: string): boolean {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }

    private getInputClassName(direction: Direction): string {
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

    private getDirectionLabel(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return this.props.strings.textAlignLeftLabel;
            case Direction.Center:
                return this.props.strings.textAlignCenterLabel;
            case Direction.Right:
                return this.props.strings.textAlignRightLabel;
            case Direction.Justify:
                return this.props.strings.textAlignJustifyLabel;
        }
    }

    private renderInput(direction: Direction): React.ReactNode {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                "dtc-text-align-control_input dtc-common-input-backplate",
                                this.getInputClassName(direction)
                            )}
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={this.getDirectionLabel(direction)}
                            onChange={this.onChange.bind(this, direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}

export { TextAlignControl };
export default TextAlignControl;
