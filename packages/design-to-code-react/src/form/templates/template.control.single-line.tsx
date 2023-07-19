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
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import controlSingleLineWrapperStyle from "design-to-code/dist/stylesheets/web-components/style/common.control-single-line-wrapper.css";
import formControlDisabledStyle from "design-to-code/dist/stylesheets/web-components/style/common.form-control-disabled.css";
import formControlIndicatorStyle from "design-to-code/dist/stylesheets/web-components/style/common.form-control-indicator.css";
import interactiveFormControlIndicatorStyle from "design-to-code/dist/stylesheets/web-components/style/common.interactive-form-control-indicator.css";
import labelStyle from "design-to-code/dist/stylesheets/web-components/style/common.label.css";
import invalidMessageStyle from "design-to-code/dist/stylesheets/web-components/style/common.invalid-message.css";
import softRemoveStyle from "design-to-code/dist/stylesheets/web-components/style/common.soft-remove.css";
import softRemoveInputStyle from "design-to-code/dist/stylesheets/web-components/style/common.soft-remove-input.css";
import style from "./template.control.single-line.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
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
    const ref: React.MutableRefObject<null> = React.createRef<null>();
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
                `dtc-single-line-control-template__disabled ${dtcClassName.commonFormControlDisabled}`,
                props.disabled,
            ])}
        >
            <div
                className={`dtc-single-line-control-template_control ${dtcClassName.commonControlSingleLineWrapper}`}
            >
                {props.control(getConfig(aggregateProps))}
                <label
                    className={`dtc-single-line-control-template_label ${dtcClassName.commonLabel}`}
                    htmlFor={props.dataLocation}
                    title={props.labelTooltip}
                >
                    {props.label}
                </label>
                {renderDefaultValueIndicator({
                    className: `dtc-single-line-control-template_default-value-indicator ${dtcClassName.commonInteractiveFormControlIndicator}`,
                    ...aggregateProps,
                })}
                {renderBadge({
                    className: `dtc-single-line-control-template_badge ${dtcClassName.commonFormControlIndicator}`,
                    ...aggregateProps,
                })}
                <div
                    className={`dtc-single-line-control-template_soft-remove ${dtcClassName.commonSoftRemove}`}
                >
                    {renderSoftRemove({
                        className: `dtc-single-line-control-template_soft-remove-input ${dtcClassName.commonSoftRemoveInput}`,
                        ...aggregateProps,
                    })}
                </div>
            </div>
            {renderInvalidMessage({
                className: `dtc-single-line-control-template_invalid-message ${dtcClassName.commonInvalidMessage}`,
                ...aggregateProps,
            })}
        </div>
    );
}

export { SingleLineControlTemplate };
export default SingleLineControlTemplate;
