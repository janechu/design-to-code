import React from "react";
import { classNames, format } from "@microsoft/fast-web-utilities";
import { SectionLinkControlProps } from "./control.section-link.props";
import { isDefault } from "./utilities/form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import style from "./control.section-link.style.css";

// tree-shaking
cssVariables;
defaultFontStyle;
style;

/**
 * Form control definition
 */
function SectionLinkControl(props: SectionLinkControlProps) {
    function handleUpdateSection(e: React.MouseEvent<HTMLAnchorElement>): void {
        props.onUpdateSection(props.dictionaryId, props.navigationConfigId);
    }

    return (
        <a
            className={classNames(
                "dtc-section-link-control",
                ["dtc-section-link-control__disabled", props.disabled],
                ["dtc-section-link-control__invalid", props.invalidMessage !== ""],
                [
                    "dtc-section-link-control__default dtc-common-default-font",
                    isDefault(props.value, props.default),
                ]
            )}
            onClick={handleUpdateSection}
        >
            {format(props.strings.sectionLinkEditLabel, props.label)}
        </a>
    );
}

export { SectionLinkControl };
export default SectionLinkControl;
