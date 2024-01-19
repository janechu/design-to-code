import React from "react";
import { DefaultValueProps } from "./default-value.props";

function DefaultValue(props: DefaultValueProps) {
    return (
        <button
            className={props.className}
            onClick={props.onChange}
            disabled={props.disabled}
            aria-label={props.strings.applyDefault}
        >
            Default
        </button>
    );
}

export default DefaultValue;
