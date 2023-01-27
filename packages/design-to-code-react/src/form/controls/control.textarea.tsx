import React from "react";
import { TextareaControlProps } from "./control.textarea.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import style from "./control.textarea.style.css";

// tree-shaking
cssVariables;
style;

export interface TextareaControlState {
    isFocused: boolean;
}

/**
 * Form control definition
 */
class TextareaControl extends React.Component<
    TextareaControlProps,
    TextareaControlState
> {
    public static displayName: string = "TextareaControl";

    constructor(props: TextareaControlProps) {
        super(props);

        this.state = {
            isFocused: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <textarea
                className={classNames(
                    "dtc-textarea-control",
                    ["dtc-textarea-control__disabled", this.props.disabled],
                    [
                        "dtc-textarea-control__default",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                name={this.props.dataLocation}
                rows={this.getRows()}
                value={this.getValue()}
                onChange={this.handleChange()}
                disabled={this.props.disabled}
                ref={this.props.elementRef as React.Ref<HTMLTextAreaElement>}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                required={this.props.required}
            />
        );
    }

    private getRows(): number {
        return typeof this.props.rows === "number" ? this.props.rows : 3;
    }

    private getValue(): string {
        // Return undefined to allow typing anywhere other than the end of the string
        // when the typing is occuring in the textarea
        if (this.state.isFocused) {
            return;
        }

        return typeof this.props.value === "string"
            ? this.props.value
            : typeof this.props.default === "string"
            ? this.props.default
            : "";
    }

    private handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
        this.props.reportValidity();

        this.setState({
            isFocused: true,
        });
    };

    private handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
        this.props.updateValidity();

        this.setState({
            isFocused: false,
        });
    };

    private handleChange = (): ((e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
        return (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            this.props.onChange({ value: e.target.value });
        };
    };
}

export { TextareaControl };
export default TextareaControl;
