import React from "react";
import ControlTemplateUtilities from "./template.control.utilities";
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
class SingleLineControlTemplate extends ControlTemplateUtilities<
    SingleLineControlTemplateProps,
    {}
> {
    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-single-line-control-template", [
                    "dtc-single-line-control-template__disabled dtc-common-form-control-disabled",
                    this.props.disabled,
                ])}
            >
                <div
                    className={
                        "dtc-single-line-control-template_control dtc-common-control-single-line-wrapper"
                    }
                >
                    {this.props.control(this.getConfig())}
                    <label
                        className={
                            "dtc-single-line-control-template_label dtc-common-label"
                        }
                        htmlFor={this.props.dataLocation}
                        title={this.props.labelTooltip}
                    >
                        {this.props.label}
                    </label>
                    {this.renderDefaultValueIndicator(
                        "dtc-single-line-control-template_default-value-indicator dtc-common-interactive-form-control-indicator"
                    )}
                    {this.renderBadge(
                        "dtc-single-line-control-template_badge dtc-common-form-control-indicator"
                    )}
                    <div
                        className={
                            "dtc-single-line-control-template_soft-remove dtc-common-soft-remove"
                        }
                    >
                        {this.renderSoftRemove(
                            "dtc-single-line-control-template_soft-remove-input dtc-common-soft-remove-input"
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    "dtc-single-line-control-template_invalid-message dtc-common-invalid-message"
                )}
            </div>
        );
    }
}

export { SingleLineControlTemplate };
export default SingleLineControlTemplate;
