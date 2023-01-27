import React from "react";
import {
    SectionValidationProps,
    SectionValidationState,
} from "./section.validation.props";
import { ValidationError } from "design-to-code";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../../style/css-variables.css";
import invalidMessageStyle from "../../../style/invalid-message-style.css";
import ellipsisStyle from "../../../style/ellipsis-style.css";
import chevronStyle from "../../../style/chevron-style.css";
import chevronUpStyle from "../../../style/chevron-up-style.css";
import style from "./section.validation.style.css";

// tree-shaking
cssVariables;
invalidMessageStyle;
ellipsisStyle;
chevronStyle;
chevronUpStyle;
style;

/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionValidation extends React.Component<
    SectionValidationProps,
    SectionValidationState
> {
    private validationIdentifier: string = "validation";

    constructor(props: SectionValidationProps) {
        super(props);

        this.state = {
            expanded: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={"dtc-section-validation"}>
                {this.renderExpandTrigger()}
                <div
                    className={
                        "dtc-section-validation_control-region dtc-common-invalid-message"
                    }
                >
                    {this.renderInvalidMessage()}
                    {this.renderValidationErrorContainer()}
                </div>
            </div>
        );
    }

    private renderInvalidMessage(): React.ReactNode {
        return (
            <div
                className={"dtc-section-validation_message dtc-common-ellipsis"}
                title={this.props.invalidMessage}
            >
                {this.props.invalidMessage}
            </div>
        );
    }

    private renderExpandTrigger(): React.ReactNode {
        if (this.props.validationErrors.length > 1) {
            return (
                <button
                    className={classNames(
                        "dtc-section-validation_expand-trigger dtc-common-chevron",
                        [
                            "dtc-section-validation_expand-trigger__active dtc-common-chevron dtc-common-chevron-up",
                            this.state.expanded,
                        ]
                    )}
                    onClick={this.handleExpandTrigger}
                    aria-expanded={this.state.expanded}
                    aria-controls={this.getId()}
                    title={"Expand to see full error list"}
                />
            );
        }
    }

    private renderValidationErrorContainer(): React.ReactNode {
        return (
            <ul id={this.getId()} className={"dtc-section-validation_error-list"}>
                {this.renderAllValidationErrors()}
            </ul>
        );
    }

    private renderAllValidationErrors(): React.ReactNode {
        if (this.state.expanded) {
            return this.props.validationErrors.map(
                (validationError: ValidationError, index: number): React.ReactNode => {
                    return (
                        <li
                            key={`${this.props.dataLocation}${index}`}
                            className={
                                "dtc-section-validation_error-list-item dtc-common-ellipsis"
                            }
                        >
                            <span title={validationError.invalidMessage}>
                                {validationError.invalidMessage}
                            </span>
                            <div
                                className={
                                    "dtc-section-validation_error-list-item-details dtc-common-ellipsis"
                                }
                                title={`data location: ${validationError.dataLocation}`}
                            >
                                {validationError.dataLocation}
                            </div>
                        </li>
                    );
                }
            );
        }
    }

    private handleExpandTrigger = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        this.setState({
            expanded: !this.state.expanded,
        });
    };

    private getId(): string {
        return `${this.props.dataLocation}${this.validationIdentifier}`;
    }
}

export { SectionValidation };
export default SectionValidation;
