/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
import React from "react";
import { FileControlProps } from "./control.file.props";
import { classNames } from "@microsoft/fast-web-utilities";
import * as DTCFile from "design-to-code/dist/esm/web-components/file/file.define.js";

// tree-shaking
DTCFile;

/**
 * @alpha
 * Custom form control definition
 */
function FileControl(props: FileControlProps & { children: React.ReactNode }) {
    /**
     * Callback for input change
     */
    function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const newValue: string = (e.target as DTCFile).fileReferences[0];
        props.onChange({ value: newValue });
    }

    return (
        <div
            className={classNames("dtc-file-control", [
                "dtc-file-control__disabled",
                props.disabled,
            ])}
        >
            <dtc-file
                accept={props.accept}
                events={{
                    change: onChange,
                }}
                disabled={props.disabled}
                control-button-stylesheet={props.stylesheets.controlButtonStylesheet}
                common-input-stylesheet={props.stylesheets.commonInputStylesheet}
                common-default-font-stylesheet={
                    props.stylesheets.commonDefaultFontStylesheet
                }
            >
                {props.children}
                <dtc-file-action-objecturl
                    role="fileaction"
                    slot="action"
                ></dtc-file-action-objecturl>
            </dtc-file>
        </div>
    );
}

export { FileControl };
export default FileControl;
