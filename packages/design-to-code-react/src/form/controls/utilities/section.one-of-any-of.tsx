import React from "react";
import { SectionOneOfAnyOfProps } from "./section.one-of-any-of.props";
import { uniqueId } from "lodash-es";
import cssVariables from "../../../style/css-variables.css";
import controlStyle from "../../../style/control-style.css";
import controlWrapperStyle from "../../../style/control-wrapper-style.css";
import selectSpanStyle from "../../../style/select-span-style.css";
import selectInputStyle from "../../../style/select-input-style.css";
import labelStyle from "../../../style/label-style.css";

// tree-shaking
cssVariables;
controlStyle;
controlWrapperStyle;
selectSpanStyle;
selectInputStyle;
labelStyle;

/**
 * Schema form component definition
 */
function SectionOneOfAnyOf(props: SectionOneOfAnyOfProps) {
    const id: string = uniqueId();

    function getActiveIndex(): number {
        return typeof props.activeIndex === "number" ? props.activeIndex : -1;
    }

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        props.onUpdate(parseInt(e.target.value, 10));
    }

    return (
        <div
            className={
                "dtc-section-one-of-any-of dtc-common-control dtc-common-control-wrapper"
            }
        >
            <label
                htmlFor={id}
                className={"dtc-section-one-of-any-of_label dtc-common-label"}
            >
                {props.label}
            </label>
            <span
                className={"dtc-section-one-of-any-of_select-span dtc-common-select-span"}
            >
                <select
                    className={"dtc-section-one-of-any-of_select dtc-common-select-input"}
                    id={id}
                    onChange={handleChange}
                    value={getActiveIndex()}
                >
                    {props.children}
                </select>
            </span>
        </div>
    );
}

export default SectionOneOfAnyOf;
export { SectionOneOfAnyOfProps };
