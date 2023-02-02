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
 * @extends React.Component
 */
class SectionOneOfAnyOf extends React.Component<
    React.PropsWithChildren<SectionOneOfAnyOfProps>,
    {}
> {
    public static displayName: string = "SectionOneOfAnyOf";

    public render(): React.ReactNode {
        const id: string = uniqueId();

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
                    {this.props.label}
                </label>
                <span
                    className={
                        "dtc-section-one-of-any-of_select-span dtc-common-select-span"
                    }
                >
                    <select
                        className={
                            "dtc-section-one-of-any-of_select dtc-common-select-input"
                        }
                        id={id}
                        onChange={this.handleChange}
                        value={this.getActiveIndex()}
                    >
                        {this.props.children}
                    </select>
                </span>
            </div>
        );
    }

    private getActiveIndex(): number {
        return typeof this.props.activeIndex === "number" ? this.props.activeIndex : -1;
    }

    private handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onUpdate(parseInt(e.target.value, 10));
    };
}

export default SectionOneOfAnyOf;
export { SectionOneOfAnyOfProps };
