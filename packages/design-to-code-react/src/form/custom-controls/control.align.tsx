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
class AlignControl extends React.Component<AlignControlProps, {}> {
    public static displayName: string = "AlignControl";

    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-align-control", [
                    "dtc-align-control__disabled",
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Alignment.top)}
                {this.renderInput(Alignment.center)}
                {this.renderInput(Alignment.bottom)}
            </div>
        );
    }

    private isChecked(direction: string): boolean {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }

    private handleChange(value: string): () => void {
        return (): void => {
            this.props.onChange({ value });
        };
    }

    private renderInput(direction: Alignment): React.ReactNode {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
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
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={`${direction} align`}
                            onChange={this.handleChange(direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}

export { AlignControl };
export default AlignControl;
