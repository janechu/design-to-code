import React from "react";
import { Orientation, RotateHandledProps, RotateUnhandledProps } from "./rotate.props";
import cssVariables from "../../style/css-variables.css";
import inputBackplateStyle from "../../style/input-backplate-style.css";
import style from "./rotate.style.css";

// tree-shaking
cssVariables;
inputBackplateStyle;
style;

export class Rotate extends React.Component<
    RotateHandledProps,
    RotateUnhandledProps,
    {}
> {
    public static displayName: string = "Rotate";

    protected handledProps: RotateHandledProps = {
        onUpdateOrientation: void 0,
        landscapeDisabled: void 0,
        portraitDisabled: void 0,
        orientation: void 0,
    };

    public render(): JSX.Element {
        return (
            <div className={"dtc-rotate"}>
                <div className={"dtc-rotate_control-input-container"}>
                    <span>
                        <input
                            type="radio"
                            aria-label={this.props.landscapeLabel || "landscape view"}
                            className={this.getInputClassName(Orientation.landscape)}
                            disabled={this.props.landscapeDisabled}
                            onChange={this.handleLandscapeClick}
                            checked={this.props.orientation === Orientation.landscape}
                            tabIndex={
                                this.props.orientation !== Orientation.landscape
                                    ? -1
                                    : undefined
                            }
                        />
                    </span>
                    <span>
                        <input
                            type="radio"
                            aria-label={this.props.portraitLabel || "portrait view"}
                            className={this.getInputClassName(Orientation.portrait)}
                            disabled={this.props.portraitDisabled}
                            onChange={this.handlePortraitClick}
                            checked={this.props.orientation === Orientation.portrait}
                            tabIndex={
                                this.props.orientation !== Orientation.portrait
                                    ? -1
                                    : undefined
                            }
                        />
                    </span>
                </div>
            </div>
        );
    }

    private getInputClassName(orientation: Orientation): string {
        let classes: string = "dtc-rotate_control-input dtc-common-input-backplate";

        switch (orientation) {
            case Orientation.landscape:
                classes = classes.concat(
                    " ",
                    "dtc-rotate_control-input__landscape",
                    this.props.landscapeDisabled
                        ? ` dtc-rotate_control-input__disabled`
                        : ""
                );
                break;
            case Orientation.portrait:
                classes = classes.concat(
                    " ",
                    "dtc-rotate_control-input__portrait",
                    this.props.portraitDisabled
                        ? ` dtc-rotate_control-input__disabled`
                        : ""
                );
                break;
        }

        return classes;
    }

    private handleOrientationUpdate = (orientation: Orientation): void => {
        this.props.onUpdateOrientation(orientation);
    };

    private handleLandscapeClick = (): void => {
        this.handleOrientationUpdate(Orientation.landscape);
    };

    private handlePortraitClick = (): void => {
        this.handleOrientationUpdate(Orientation.portrait);
    };
}
