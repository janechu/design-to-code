import React from "react";
import ControlTemplateUtilities from "./template.control.utilities";
import { StandardControlTemplateProps } from "./template.control.standard.props";
import { ControlContext } from "./types";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
import interactiveFormControlIndicatorStyle from "../../style/interactive-form-control-indicator-style.css";
import softRemoveStyle from "../../style/soft-remove-style.css";
import softRemoveInputStyle from "../../style/soft-remove-input-style.css";
import controlWrapperStyle from "../../style/control-wrapper-style.css";
import formControlDisabledStyle from "../../style/form-control-disabled-style.css";
import controlRegionStyle from "../../style/control-region-style.css";
import controlStyle from "../../style/control-style.css";
import labelRegionStyle from "../../style/label-region-style.css";
import labelStyle from "../../style/label-style.css";
import invalidMessageStyle from "../../style/invalid-message-style.css";
import formControlIndicatorStyle from "../../style/form-control-indicator-style.css";
import style from "./template.control.standard.style.css";

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
class StandardControlTemplate extends ControlTemplateUtilities<
    StandardControlTemplateProps,
    {}
> {
    public static defaultProps: Partial<StandardControlTemplateProps> = {
        context: ControlContext.default,
    };

    public render(): React.ReactNode {
        return (
            <div
                className={classNames(
                    "dtc-standard-control-template dtc-common-control-wrapper",
                    [
                        "dtc-standard-control-template__disabled dtc-common-form-control-disabled",
                        this.props.disabled,
                    ]
                )}
            >
                <div
                    className={
                        "dtc-standard-control-template_control-region dtc-common-control-region"
                    }
                >
                    <div
                        className={
                            "dtc-standard-control-template_control dtc-common-control"
                        }
                    >
                        <div
                            className={
                                "dtc-standard-control-template_control-label-region dtc-common-label-region"
                            }
                        >
                            <label
                                htmlFor={this.props.dataLocation}
                                className={
                                    "dtc-standard-control-template_control-label dtc-common-label"
                                }
                                title={this.props.labelTooltip}
                            >
                                {this.props.label}
                            </label>
                            {this.renderConstValueIndicator(
                                "dtc-standard-control-template_const-value-indicator dtc-common-interactive-form-control-indicator"
                            )}
                            {this.renderDefaultValueIndicator(
                                "dtc-standard-control-template_default-value-indicator dtc-common-interactive-form-control-indicator"
                            )}
                            {this.renderBadge(
                                "dtc-standard-control-template_badge dtc-common-form-control-indicator"
                            )}
                        </div>
                        {this.renderControl(ControlContext.default)}
                    </div>
                    <div
                        className={
                            "dtc-standard-control-template_soft-remove dtc-common-soft-remove"
                        }
                    >
                        {this.renderSoftRemove(
                            "dtc-standard-control-template_soft-remove-input dtc-common-soft-remove-input"
                        )}
                    </div>
                </div>
                {this.renderControl(ControlContext.fill)}
                {this.renderInvalidMessage(
                    "dtc-standard-control-template_invalid-message dtc-common-invalid-message"
                )}
            </div>
        );
    }

    private renderControl(context: ControlContext): React.ReactNode {
        return context === this.props.context
            ? this.props.control(this.getConfig())
            : null;
    }
}

export { StandardControlTemplate };
export default StandardControlTemplate;
