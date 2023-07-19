import React from "react";
import {
    getConfig,
    renderBadge,
    renderConstValueIndicator,
    renderDefaultValueIndicator,
    renderInvalidMessage,
    renderSoftRemove,
} from "./template.control.utilities";
import { StandardControlTemplateProps } from "./template.control.standard.props";
import { ControlContext } from "./types";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import interactiveFormControlIndicatorStyle from "design-to-code/dist/stylesheets/web-components/style/common.interactive-form-control-indicator.css";
import softRemoveStyle from "design-to-code/dist/stylesheets/web-components/style/common.soft-remove.css";
import softRemoveInputStyle from "design-to-code/dist/stylesheets/web-components/style/common.soft-remove-input.css";
import controlWrapperStyle from "design-to-code/dist/stylesheets/web-components/style/common.control-wrapper.css";
import formControlDisabledStyle from "design-to-code/dist/stylesheets/web-components/style/common.form-control-disabled.css";
import controlRegionStyle from "design-to-code/dist/stylesheets/web-components/style/common.control-region.css";
import controlStyle from "design-to-code/dist/stylesheets/web-components/style/common.control.css";
import labelRegionStyle from "design-to-code/dist/stylesheets/web-components/style/common.label-region.css";
import labelStyle from "design-to-code/dist/stylesheets/web-components/style/common.label.css";
import invalidMessageStyle from "design-to-code/dist/stylesheets/web-components/style/common.invalid-message.css";
import formControlIndicatorStyle from "design-to-code/dist/stylesheets/web-components/style/common.form-control-indicator.css";
import style from "./template.control.standard.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import { FormHTMLElement } from "./template.control.utilities.props";

// tree-shaking
cssVariables;
interactiveFormControlIndicatorStyle;
softRemoveStyle;
softRemoveInputStyle;
controlWrapperStyle;
formControlDisabledStyle;
controlRegionStyle;
controlStyle;
labelRegionStyle;
labelStyle;
invalidMessageStyle;
formControlIndicatorStyle;
style;

/**
 * Control template definition
 */
function StandardControlTemplate(props: StandardControlTemplateProps) {
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

    function renderControl(context: ControlContext): React.ReactNode {
        return context === (props.context || ControlContext.default)
            ? props.control(getConfig({ ...aggregateProps }))
            : null;
    }

    return (
        <div
            className={classNames(
                "dtc-standard-control-template dtc-common-control-wrapper",
                [
                    `dtc-standard-control-template__disabled ${dtcClassName.commonFormControlDisabled}`,
                    props.disabled,
                ]
            )}
        >
            <div
                className={`dtc-standard-control-template_control-region ${dtcClassName.commonControlRegion}`}
            >
                <div
                    className={`dtc-standard-control-template_control ${dtcClassName.commonControl}`}
                >
                    <div
                        className={`dtc-standard-control-template_control-label-region ${dtcClassName.commonLabelRegion}`}
                    >
                        <label
                            htmlFor={props.dataLocation}
                            className={`dtc-standard-control-template_control-label ${dtcClassName.commonLabel}`}
                            title={props.labelTooltip}
                        >
                            {props.label}
                        </label>
                        {renderConstValueIndicator({
                            className: `dtc-standard-control-template_const-value-indicator ${dtcClassName.commonInteractiveFormControlIndicator}`,
                            ...aggregateProps,
                        })}
                        {renderDefaultValueIndicator({
                            className: `dtc-standard-control-template_default-value-indicator ${dtcClassName.commonInteractiveFormControlIndicator}`,
                            ...aggregateProps,
                        })}
                        {renderBadge({
                            className: `dtc-standard-control-template_badge ${dtcClassName.commonFormControlIndicator}`,
                            ...aggregateProps,
                        })}
                    </div>
                    {renderControl(ControlContext.default)}
                </div>
                <div
                    className={`dtc-standard-control-template_soft-remove ${dtcClassName.commonSoftRemove}`}
                >
                    {renderSoftRemove({
                        className: `dtc-standard-control-template_soft-remove-input ${dtcClassName.commonSoftRemoveInput}`,
                        ...aggregateProps,
                    })}
                </div>
            </div>
            {renderControl(ControlContext.fill)}
            {renderInvalidMessage({
                className: `dtc-standard-control-template_invalid-message ${dtcClassName.commonInvalidMessage}`,
                ...aggregateProps,
            })}
        </div>
    );
}

export { StandardControlTemplate };
export default StandardControlTemplate;
