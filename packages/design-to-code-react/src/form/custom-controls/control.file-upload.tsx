import React, { useEffect, useState } from "react";
import { uniqueId } from "lodash-es";
import { FileUploadControlProps } from "./control.file-upload.props";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Custom form control definition
 */
function FileUploadControl(props: FileUploadControlProps) {
    /**
     * The id of the file input
     */
    const fileId: string = uniqueId();

    /**
     * File reader to handle reading / parsing of file data
     */
    const reader: FileReader = new FileReader();

    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        reader.addEventListener("load", handleReaderLoad);

        return function cleanup() {
            reader.removeEventListener("load", handleReaderLoad);
        };
    });

    /**
     * Callback to call when the reader loads file data
     */
    function handleReaderLoad(): void {
        setProcessing(false);
        props.onChange({ value: reader.result });
    }

    /**
     * Event handler that effectively cancels the event
     */
    function cancelEvent(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
    }

    /**
     * Updates the component with new file data
     */
    function updateWithFile(file: File): void {
        // We should exit if file is not actually a File or the type is not an image
        if (!(file instanceof File) || !file.type.includes("image")) {
            return;
        }

        setProcessing(true);
        reader.readAsDataURL(file);
    }

    /**
     * Event handler for drag-area dragover event
     */
    function dragOver(e: React.DragEvent<HTMLDivElement>): void {
        cancelEvent(e);

        if (!dragging) {
            setDragging(true);
        }
    }

    /**
     * Event handler for drag-area drag-leave event
     */
    function dragLeave(e: React.DragEvent<HTMLDivElement>): void {
        cancelEvent(e);

        setDragging(false);
    }

    /**
     * Callback for drop event
     */
    function onDrop(e: React.DragEvent<HTMLDivElement>): void {
        cancelEvent(e);

        setDragging(false);
        updateWithFile(e.dataTransfer.files[0]);
    }

    /**
     * Callback for input change
     */
    function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
        updateWithFile(e.target.files[0]);
    }

    function generateStaticUI(): React.ReactNode {
        return [
            typeof props.value === "string" ? (
                <img
                    key={"thumbnail"}
                    src={props.value}
                    alt={props.strings.fileUploadPreviewAlt}
                />
            ) : null,
            <input
                key={"input"}
                className={"dtc-file-upload-control_input"}
                type={"file"}
                id={fileId}
                onChange={handleInputOnChange}
            />,
            <p key={"info"}>
                {props.strings.fileUploadDragInstr}{" "}
                <label htmlFor={fileId}>{props.strings.fileUploadBrowseFiles}</label>
            </p>,
        ];
    }

    function generateProcessingUI(): JSX.Element {
        return <p>{props.strings.fileUploadUploading}</p>;
    }

    return (
        <div
            className={classNames("dtc-file-upload-control", [
                "dtc-file-upload-control__disabled",
                props.disabled,
            ])}
            onDragEnter={cancelEvent}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onDrop={onDrop}
        >
            {processing ? generateProcessingUI() : generateStaticUI()}
        </div>
    );
}

export { FileUploadControl };
export default FileUploadControl;
