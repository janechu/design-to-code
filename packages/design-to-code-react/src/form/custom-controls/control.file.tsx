/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
import React from "react";
import { FileControlProps } from "./control.file.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { fileComponent } from "design-to-code/dist/esm/web-components";

/**
 * @alpha
 * Custom form control definition
 */
class FileControl extends React.Component<
    FileControlProps & { children: React.ReactNode }
> {
    public static displayName: string = "FileControl";

    /**
     * Render the component
     */
    public render(): React.ReactNode {
        return (
            <div
                className={classNames("dtc-file-control", [
                    "dtc-file-control__disabled",
                    this.props.disabled,
                ])}
            >
                <dtc-file
                    accept={this.props.accept}
                    events={{
                        change: this.onChange,
                    }}
                    disabled={this.props.disabled}
                >
                    {this.props.children}
                    <dtc-file-action-objecturl
                        role="fileaction"
                        slot="action"
                    ></dtc-file-action-objecturl>
                </dtc-file>
            </div>
        );
    }

    /**
     * Callback for input change
     */
    public onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = (e.target as fileComponent).fileReferences[0];
        this.props.onChange({ value: newValue });
    };
}

export { FileControl };
export default FileControl;
