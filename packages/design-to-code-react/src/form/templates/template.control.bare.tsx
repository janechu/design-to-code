import React from "react";
import { getConfig } from "./template.control.utilities";
import { BareControlTemplateProps } from "./template.control.bare.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { FormHTMLElement } from "./template.control.utilities.props";

/**
 * Control template definition
 */
function BareControlTemplate(props: BareControlTemplateProps) {
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
            className={classNames("dtc-bare-control-template", [
                "dtc-bare-control-template__disabled",
                props.disabled,
            ])}
        >
            {props.control(getConfig(aggregateProps))}
        </div>
    );
}

export { BareControlTemplate };
export default BareControlTemplate;
