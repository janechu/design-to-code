import React, { useEffect, useState } from "react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import rafThrottle from "raf-throttle";
import {
    ResizeHandleLocation,
    ViewerHandledProps,
    ViewerUnhandledProps,
    ViewerCustomAction,
} from "./viewer.props";
import { MessageSystemType, Register } from "design-to-code";

export function Viewer(props: ViewerHandledProps & ViewerUnhandledProps) {
    let iframeRef: React.RefObject<HTMLIFrameElement>;
    const [resizing, setResizing] = useState(false);
    const [dragReferenceY, setDragReferenceY] = useState(null);
    const [dragReferenceX, setDragReferenceX] = useState(null);
    const [dragHandleLocation, setDragHandleLocation] = useState(null);
    const messageSystemConfig: Register = {
        onMessage: handleMessageSystem,
    };

    if (props.messageSystem !== undefined) {
        props.messageSystem.add(messageSystemConfig);
    }

    iframeRef = React.createRef();
    const throttledHandleMouseMove = rafThrottle(handleMouseMove);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", throttledHandleMouseMove);

        return function cleanup() {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", throttledHandleMouseMove);
        };
    });

    function renderResponsiveLeftHandle(): JSX.Element {
        if (props.responsive) {
            return (
                <button
                    className={`dtc-viewer-handle dtc-viewer-handle__left`}
                    onMouseDown={handleMouseDown(ResizeHandleLocation.left)}
                />
            );
        }
    }

    function renderResponsiveRightHandle(): JSX.Element {
        if (props.responsive) {
            return (
                <button
                    className={`dtc-viewer-handle dtc-viewer-handle__right`}
                    onMouseDown={handleMouseDown(ResizeHandleLocation.right)}
                />
            );
        }
    }

    function renderResponsiveBottomRow(): JSX.Element {
        if (props.responsive) {
            return (
                <React.Fragment>
                    <button
                        className={`dtc-viewer-handle dtc-viewer-handle__bottom-left`}
                        onMouseDown={handleMouseDown(ResizeHandleLocation.bottomLeft)}
                    />
                    <button
                        className={`dtc-viewer-handle dtc-viewer-handle__bottom`}
                        aria-hidden={true}
                        onMouseDown={handleMouseDown(ResizeHandleLocation.bottom)}
                    />
                    <button
                        className={`dtc-viewer-handle dtc-viewer-handle__bottom-right`}
                        onMouseDown={handleMouseDown(ResizeHandleLocation.bottomRight)}
                    />
                </React.Fragment>
            );
        }
    }

    function getHeight(): any {
        if (props.height) {
            return {
                height: `${props.height}px`,
            };
        }
    }

    function getWidth(): any {
        if (props.width) {
            return {
                width: `${props.width}px`,
            };
        }
    }

    function generateContentRegionClassNames(): string {
        let classes: string = "dtc-viewer_content-region";

        if (props.preview) {
            classes += ` ${"dtc-viewer_content-region__preview"}`;
        }

        if (resizing) {
            classes += ` ${"dtc-viewer_content-region__disabled"}`;
        }

        return classes;
    }

    function postMessage(message: MessageEvent): void {
        if (canUseDOM() && get(iframeRef, "current.contentWindow")) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify(message), "*");
        }
    }

    function handleIframeMessage(e: MessageEvent): void {
        if (
            e.data &&
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.call
        ) {
            e.stopImmediatePropagation();
            props.messageSystem.postMessage({
                ...e.data,
                action: ViewerCustomAction.response,
            });
        }
    }

    function handleMessageSystem(e: MessageEvent): void {
        postMessage(e.data);
    }

    /**
     * Handle mouseUp
     */
    function handleMouseUp(e: MouseEvent): void {
        // only listen for left click
        if (e.button !== 0) {
            return;
        }

        setResizing(false);
        setDragReferenceY(null);
        setDragReferenceX(null);
        setDragHandleLocation(null);
    }

    function handleMouseMove(e: MouseEvent): void {
        if (!resizing) {
            return;
        }

        const heightOffset: number = dragReferenceY - e.pageY;
        const widthOffset: number = (dragReferenceX - e.pageX) * 2;
        const updatedHeight: number = props.height - heightOffset;
        const updatedWidthLeft: number = props.width + widthOffset;
        const updatedWidthRight: number = props.width - widthOffset;

        switch (dragHandleLocation) {
            case ResizeHandleLocation.bottom:
                setDragReferenceY(e.pageY);

                handleUpdateHeight(updatedHeight);
                break;
            case ResizeHandleLocation.bottomLeft:
                setDragReferenceY(e.pageY);
                setDragReferenceX(e.pageX);

                handleUpdateHeight(updatedHeight);
                handleUpdateWidth(updatedWidthLeft);
                break;
            case ResizeHandleLocation.bottomRight:
                setDragReferenceY(e.pageY);
                setDragReferenceX(e.pageX);

                handleUpdateHeight(updatedHeight);
                handleUpdateWidth(updatedWidthRight);
                break;
            case ResizeHandleLocation.left:
                setDragReferenceX(e.pageX);

                handleUpdateWidth(updatedWidthLeft);
                break;
            case ResizeHandleLocation.right:
                setDragReferenceX(e.pageX);

                handleUpdateWidth(updatedWidthRight);
                break;
        }
    }

    function handleMouseDown(
        handleLocation: ResizeHandleLocation
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            // only listen for left click
            if (e.button !== 0) {
                return;
            }

            switch (handleLocation) {
                case ResizeHandleLocation.bottom:
                    handleBottomMouseDown(e);
                    break;
                case ResizeHandleLocation.bottomRight:
                    handleBottomRightMouseDown(e);
                    break;
                case ResizeHandleLocation.bottomLeft:
                    handleBottomLeftMouseDown(e);
                    break;
                case ResizeHandleLocation.left:
                    handleLeftMouseDown(e);
                    break;
                case ResizeHandleLocation.right:
                    handleRightMouseDown(e);
                    break;
            }
        };
    }

    function handleBottomMouseDown(e: React.MouseEvent<HTMLButtonElement>): void {
        setResizing(true);
        setDragReferenceY(e.pageY);
        setDragHandleLocation(ResizeHandleLocation.bottom);
    }

    function handleBottomRightMouseDown(e: React.MouseEvent<HTMLButtonElement>): void {
        setResizing(true);
        setDragReferenceY(e.pageY);
        setDragReferenceX(e.pageX);
        setDragHandleLocation(ResizeHandleLocation.bottomRight);
    }

    function handleBottomLeftMouseDown(e: React.MouseEvent<HTMLButtonElement>): void {
        setResizing(true);
        setDragReferenceY(e.pageY);
        setDragReferenceX(e.pageX);
        setDragHandleLocation(ResizeHandleLocation.bottomLeft);
    }

    function handleLeftMouseDown(e: React.MouseEvent<HTMLButtonElement>): void {
        setResizing(true);
        setDragReferenceX(e.pageX);
        setDragHandleLocation(ResizeHandleLocation.left);
    }

    function handleRightMouseDown(e: React.MouseEvent<HTMLButtonElement>): void {
        setResizing(true);
        setDragReferenceX(e.pageX);
        setDragHandleLocation(ResizeHandleLocation.right);
    }

    function handleUpdateHeight(height: number): void {
        if (props.onUpdateHeight) {
            props.onUpdateHeight(height);
        }
    }

    function handleUpdateWidth(width: number): void {
        if (props.onUpdateWidth) {
            props.onUpdateWidth(width);
        }
    }

    return (
        <div className={"dtc-viewer"}>
            <div
                className={generateContentRegionClassNames()}
                style={{
                    ...getHeight(),
                    ...getWidth(),
                }}
            >
                {renderResponsiveLeftHandle()}
                <base target="_blank" />
                <iframe
                    ref={iframeRef}
                    className={"dtc-viewer_iframe"}
                    src={props.iframeSrc}
                >
                    Your browser does not support iframes.
                </iframe>
                {renderResponsiveRightHandle()}
                {renderResponsiveBottomRow()}
            </div>
        </div>
    );
}
