import React from "react";
import { SectionOneOfAnyOfProps } from "./section.one-of-any-of.props";
import { uniqueId } from "lodash-es";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import controlStyle from "design-to-code/dist/stylesheets/web-components/style/common.control.css";
import controlWrapperStyle from "design-to-code/dist/stylesheets/web-components/style/common.control-wrapper.css";
import selectSpanStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-span.css";
import selectInputStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-input.css";
import labelStyle from "design-to-code/dist/stylesheets/web-components/style/common.label.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

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
            className={`dtc-section-one-of-any-of ${dtcClassName.commonControl} dtc-common-control-wrapper`}
        >
            <label
                htmlFor={id}
                className={`dtc-section-one-of-any-of_label ${dtcClassName.commonLabel}`}
            >
                {props.label}
            </label>
            <span
                className={`dtc-section-one-of-any-of_select-span ${dtcClassName.commonSelectSpan}`}
            >
                <select
                    className={`dtc-section-one-of-any-of_select ${dtcClassName.commonSelectInput}`}
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
