import React from "react";
import { ThemeControlProps } from "./control.theme.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import themeStyle from "./control.theme.style.css";

// tree-shaking
cssVariables;
themeStyle;

enum Theme {
    Light = "light",
    Dark = "dark",
}

/**
 * Custom form control definition
 */
function ThemeControl(props: ThemeControlProps) {
    function onChange(value: string): void {
        props.onChange({ value });
    }

    function isChecked(theme: string): boolean {
        return (
            props.value === theme ||
            (typeof props.value === "undefined" && props.default === theme)
        );
    }

    function getInputClassName(theme: Theme): string {
        return theme === Theme.Dark
            ? "dtc-theme-control_input__dark"
            : "dtc-theme-control_input__light";
    }

    function getThemeLabel(theme: Theme): string {
        switch (theme) {
            case Theme.Dark:
                return props.strings.themeDarkLabel;
            case Theme.Light:
                return props.strings.themeLightLabel;
        }
    }

    function renderInput(theme: Theme): JSX.Element {
        if (props.options && Array.isArray(props.options)) {
            const option: any = props.options.find((item: string): any => {
                return item === theme;
            });

            if (typeof option !== "undefined") {
                return (
                    <input
                        className={classNames(
                            "dtc-theme-control_input",
                            getInputClassName(theme)
                        )}
                        id={props.dataLocation}
                        type={"radio"}
                        value={theme}
                        name={props.dataLocation}
                        aria-label={getThemeLabel(theme)}
                        onChange={onChange.bind(this, theme)}
                        checked={isChecked(theme)}
                        disabled={props.disabled}
                    />
                );
            }
        }
    }

    return (
        <div
            className={classNames("dtc-theme-control", [
                "dtc-theme-control__disabled",
                props.disabled,
            ])}
        >
            {renderInput(Theme.Light)}
            {renderInput(Theme.Dark)}
        </div>
    );
}

export { ThemeControl };
export default ThemeControl;
