import React from "react";
import {
    getConfig,
    renderBadge,
    renderDefaultValueIndicator,
    renderInvalidMessage,
    renderSoftRemove,
} from "./template.control.utilities";
import { SingleLineControlTemplateProps } from "./template.control.single-line.props";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
import controlSingleLineWrapperStyle from "../../style/control-single-line-wrapper-style.css";
import formControlDisabledStyle from "../../style/form-control-disabled-style.css";
import formControlIndicatorStyle from "../../style/form-control-indicator-style.css";
import interactiveFormControlIndicatorStyle from "../../style/interactive-form-control-indicator-style.css";
import labelStyle from "../../style/label-style.css";
import invalidMessageStyle from "../../style/invalid-message-style.css";
import softRemoveStyle from "../../style/soft-remove-style.css";
import softRemoveInputStyle from "../../style/soft-remove-input-style.css";
import style from "./template.control.single-line.style.css";
import { FormHTMLElement } from "./template.control.utilities.props";

// tree-shaking
cssVariables;
controlSingleLineWrapperStyle;
formControlDisabledStyle;
formControlIndicatorStyle;
interactiveFormControlIndicatorStyle;
labelStyle;
invalidMessageStyle;
softRemoveStyle;
softRemoveInputStyle;
style;

/**
 * Control template definition
 */
function SingleLineControlTemplate(props: SingleLineControlTemplateProps) {
    const ref: React.RefObject<FormHTMLElement> = React.createRef<FormHTMLElement>();
    let cache: any = undefined;

    function setCache(updatedCache: any): void {
        cache = updatedCache;
    }

    const aggregateProps = {
        ...props,
        ref,
        cache,
        setCache,
    };

    return (
        <div
            className={classNames("dtc-single-line-control-template", [
                "dtc-single-line-control-template__disabled dtc-common-form-control-disabled",
                props.disabled,
            ])}
        >
            <div
                className={
                    "dtc-single-line-control-template_control dtc-common-control-single-line-wrapper"
                }
            >
                {props.control(getConfig(aggregateProps))}
                <label
                    className={"dtc-single-line-control-template_label dtc-common-label"}
                    htmlFor={props.dataLocation}
                    title={props.labelTooltip}
                >
                    {props.label}
                </label>
                {renderDefaultValueIndicator({
                    className:
                        "dtc-single-line-control-template_default-value-indicator dtc-common-interactive-form-control-indicator",
                    ...aggregateProps,
                })}
                {renderBadge({
                    className:
                        "dtc-single-line-control-template_badge dtc-common-form-control-indicator",
                    ...aggregateProps,
                })}
                <div
                    className={
                        "dtc-single-line-control-template_soft-remove dtc-common-soft-remove"
                    }
                >
                    {renderSoftRemove({
                        className:
                            "dtc-single-line-control-template_soft-remove-input dtc-common-soft-remove-input",
                        ...aggregateProps,
                    })}
                </div>
            </div>
            {renderInvalidMessage({
                className:
                    "dtc-single-line-control-template_invalid-message dtc-common-invalid-message",
                ...aggregateProps,
            })}
        </div>
    );
}

export { SingleLineControlTemplate };
export default SingleLineControlTemplate;
