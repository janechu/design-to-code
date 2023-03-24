import React from "react";
import { Orientation, RotateProps } from "./rotate.props";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputBackplateStyle from "design-to-code/dist/stylesheets/web-components/style/common.input-backplate.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./rotate.style.css";

// tree-shaking
cssVariables;
inputBackplateStyle;
style;

export function Rotate(props: RotateProps) {
    function getInputClassName(orientation: Orientation): string {
        let classes: string = `dtc-rotate_control-input ${dtcClassName.commonInputBackplate}`;

        switch (orientation) {
            case Orientation.landscape:
                classes = classes.concat(
                    " ",
                    "dtc-rotate_control-input__landscape",
                    props.landscapeDisabled ? ` dtc-rotate_control-input__disabled` : ""
                );
                break;
            case Orientation.portrait:
                classes = classes.concat(
                    " ",
                    "dtc-rotate_control-input__portrait",
                    props.portraitDisabled ? ` dtc-rotate_control-input__disabled` : ""
                );
                break;
        }

        return classes;
    }

    function handleOrientationUpdate(orientation: Orientation): void {
        props.onUpdateOrientation(orientation);
    }

    function handleLandscapeClick(): void {
        handleOrientationUpdate(Orientation.landscape);
    }

    function handlePortraitClick(): void {
        handleOrientationUpdate(Orientation.portrait);
    }

    return (
        <div className={"dtc-rotate"}>
            <div className={"dtc-rotate_control-input-container"}>
                <input
                    type="radio"
                    aria-label={props.landscapeLabel || "landscape view"}
                    className={getInputClassName(Orientation.landscape)}
                    disabled={props.landscapeDisabled}
                    onChange={handleLandscapeClick}
                    checked={props.orientation === Orientation.landscape}
                    tabIndex={
                        props.orientation !== Orientation.landscape ? -1 : undefined
                    }
                />
                <input
                    type="radio"
                    aria-label={props.portraitLabel || "portrait view"}
                    className={getInputClassName(Orientation.portrait)}
                    disabled={props.portraitDisabled}
                    onChange={handlePortraitClick}
                    checked={props.orientation === Orientation.portrait}
                    tabIndex={props.orientation !== Orientation.portrait ? -1 : undefined}
                />
            </div>
        </div>
    );
}
