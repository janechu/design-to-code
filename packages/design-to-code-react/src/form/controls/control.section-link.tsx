import React from "react";
import { classNames, format } from "@microsoft/fast-web-utilities";
import { SectionLinkControlProps } from "./control.section-link.props";
import { isDefault } from "./utilities/form";
import cssVariables from "../../style/css-variables.css";
import defaultFontStyle from "../../style/default-font-style.css";
import style from "./control.section-link.style.css";

// tree-shaking
cssVariables;
defaultFontStyle;
style;

/**
 * Form control definition
 */
class SectionLinkControl extends React.Component<SectionLinkControlProps, {}> {
    public static displayName: string = "SectionLinkControl";

    public render(): React.ReactNode {
        return (
            <a
                className={classNames(
                    "dtc-section-link-control",
                    ["dtc-section-link-control__disabled", this.props.disabled],
                    [
                        "dtc-section-link-control__invalid",
                        this.props.invalidMessage !== "",
                    ],
                    [
                        "dtc-section-link-control__default dtc-common-default-font",
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                onClick={this.handleUpdateSection}
            >
                {format(this.props.strings.sectionLinkEditLabel, this.props.label)}
            </a>
        );
    }

    private handleUpdateSection = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        this.props.onUpdateSection(
            this.props.dictionaryId,
            this.props.navigationConfigId
        );
    };
}

export { SectionLinkControl };
export default SectionLinkControl;
