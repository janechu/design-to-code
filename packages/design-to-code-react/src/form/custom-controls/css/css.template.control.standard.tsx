import React from "react";
import {
    CSSControlConfig,
    CSSStandardControlTemplateProps,
} from "./css.template.control.standard.props";

/**
 * Control template definition
 *
 * This is the standard control template that may be used for a CSS plugin.
 */
export default function CSSStandardControlTemplate(
    props: CSSStandardControlTemplateProps
) {
    function getConfig(): CSSControlConfig {
        return {
            css: props.css,
            onChange: props.onChange,
            value: props.value,
        };
    }

    return props.control(getConfig());
}
