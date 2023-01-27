import React from "react";
import ControlTemplateUtilities from "./template.control.utilities";
import { BareControlTemplateProps } from "./template.control.bare.props";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Control template definition
 */
class BareControlTemplate extends ControlTemplateUtilities<BareControlTemplateProps, {}> {
    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-bare-control-template", [
                    "dtc-bare-control-template__disabled",
                    this.props.disabled,
                ])}
            >
                {this.props.control(this.getConfig())}
            </div>
        );
    }
}

export { BareControlTemplate };
export default BareControlTemplate;
