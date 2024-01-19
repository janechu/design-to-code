import React from "react";
import { ConstValueProps } from "./const-value.props";

function ConstValue(props: ConstValueProps) {
    return (
        <button
            className={props.className}
            onClick={props.onChange}
            disabled={props.disabled}
            aria-label={props.strings.applyConst}
        >
            Const
        </button>
    );
}

export default ConstValue;
