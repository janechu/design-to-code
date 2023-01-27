import React from "react";
import { ThemeControlProps } from "./control.theme.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
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
class ThemeControl extends React.Component<ThemeControlProps, {}> {
    public static displayName: string = "ThemeControl";

    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-theme-control", [
                    "dtc-theme-control__disabled",
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Theme.Light)}
                {this.renderInput(Theme.Dark)}
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange({ value });
    };

    private isChecked(theme: string): boolean {
        return (
            this.props.value === theme ||
            (typeof this.props.value === "undefined" && this.props.default === theme)
        );
    }

    private getInputClassName(theme: Theme): string {
        return theme === Theme.Dark
            ? "dtc-theme-control_input__dark"
            : "dtc-theme-control_input__light";
    }

    private getThemeLabel(theme: Theme): string {
        switch (theme) {
            case Theme.Dark:
                return this.props.strings.themeDarkLabel;
            case Theme.Light:
                return this.props.strings.themeLightLabel;
        }
    }

    private renderInput(theme: Theme): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: any = this.props.options.find((item: string): any => {
                return item === theme;
            });

            if (typeof option !== "undefined") {
                return (
                    <input
                        className={classNames(
                            "dtc-theme-control_input",
                            this.getInputClassName(theme)
                        )}
                        id={this.props.dataLocation}
                        type={"radio"}
                        value={theme}
                        name={this.props.dataLocation}
                        aria-label={this.getThemeLabel(theme)}
                        onChange={this.onChange.bind(this, theme)}
                        checked={this.isChecked(theme)}
                        disabled={this.props.disabled}
                    />
                );
            }
        }
    }
}

export { ThemeControl };
export default ThemeControl;
