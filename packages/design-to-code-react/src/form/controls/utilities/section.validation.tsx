import React, { useState } from "react";
import { SectionValidationProps } from "./section.validation.props";
import { ValidationError } from "design-to-code";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import invalidMessageStyle from "design-to-code/dist/stylesheets/web-components/style/common.invalid-message.css";
import ellipsisStyle from "design-to-code/dist/stylesheets/web-components/style/common.ellipsis.css";
import chevronStyle from "design-to-code/dist/stylesheets/web-components/style/common.chevron.css";
import chevronUpStyle from "design-to-code/dist/stylesheets/web-components/style/common.chevron-up.css";
import style from "./section.validation.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

// tree-shaking
cssVariables;
invalidMessageStyle;
ellipsisStyle;
chevronStyle;
chevronUpStyle;
style;

/**
 * Schema form component definition
 */
function SectionValidation(props: SectionValidationProps) {
    const validationIdentifier: string = "validation";
    const [expanded, setExpanded] = useState(false);

    function renderInvalidMessage(): React.ReactNode {
        return (
            <div
                className={`dtc-section-validation_message ${dtcClassName.commonEllipsis}`}
                title={props.invalidMessage}
            >
                {props.invalidMessage}
            </div>
        );
    }

    function renderExpandTrigger(): React.ReactNode {
        if (props.validationErrors.length > 1) {
            return (
                <button
                    className={classNames(
                        `dtc-section-validation_expand-trigger ${dtcClassName.commonChevron}`,
                        [
                            `dtc-section-validation_expand-trigger__active ${dtcClassName.commonChevron} ${dtcClassName.commonChevronUp}`,
                            expanded,
                        ]
                    )}
                    onClick={handleExpandTrigger}
                    aria-expanded={expanded}
                    aria-controls={getId()}
                    title={"Expand to see full error list"}
                />
            );
        }
    }

    function renderValidationErrorContainer(): React.ReactNode {
        return (
            <ul id={getId()} className={"dtc-section-validation_error-list"}>
                {renderAllValidationErrors()}
            </ul>
        );
    }

    function renderAllValidationErrors(): React.ReactNode {
        if (expanded) {
            return props.validationErrors.map(
                (validationError: ValidationError, index: number): React.ReactNode => {
                    return (
                        <li
                            key={`${props.dataLocation}${index}`}
                            className={`dtc-section-validation_error-list-item ${dtcClassName.commonEllipsis}`}
                        >
                            <span title={validationError.invalidMessage}>
                                {validationError.invalidMessage}
                            </span>
                            <div
                                className={`dtc-section-validation_error-list-item-details ${dtcClassName.commonEllipsis}`}
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

    function handleExpandTrigger(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();

        setExpanded(!expanded);
    }

    function getId(): string {
        return `${props.dataLocation}${validationIdentifier}`;
    }

    return (
        <div className={"dtc-section-validation"}>
            {renderExpandTrigger()}
            <div
                className={`dtc-section-validation_control-region ${dtcClassName.commonInvalidMessage}`}
            >
                {renderInvalidMessage()}
                {renderValidationErrorContainer()}
            </div>
        </div>
    );
}

export { SectionValidation };
export default SectionValidation;
