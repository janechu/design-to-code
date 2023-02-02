import { CustomMessage, MessageSystem } from "design-to-code";

export enum ResizeHandleLocation {
    left,
    right,
    bottom,
    bottomLeft,
    bottomRight,
}

export enum ViewerCustomAction {
    call = "call",
    response = "response",
}

export type ViewerUnhandledProps = React.AllHTMLAttributes<HTMLElement>;
export interface ViewerHandledProps {
    /**
     * The src route for the viewer iframe
     */
    iframeSrc: string;

    /**
     * The responsive, resizable functionality for the viewer
     */
    responsive?: boolean;

    /**
     * The height of the viewer
     */
    height?: number;

    /**
     * The width of the viewer
     */
    width?: number;

    /**
     * A callback for when height should update
     */
    onUpdateHeight?: (height: number) => void;

    /**
     * A callback for when width should update
     */
    onUpdateWidth?: (width: number) => void;

    /**
     * The message system
     * used for sending and receiving data to the message system
     */
    messageSystem: MessageSystem;

    /**
     * The preview mode of the viewer
     */
    preview?: boolean;
}

export type ViewerProps = ViewerUnhandledProps & ViewerHandledProps;

export interface CustomViewerCallMessage extends CustomMessage<{}, {}> {
    /**
     * A message send from the Viewer iframe window
     */
    action: ViewerCustomAction.call;
}

export interface CustomViewerResponseMessage extends CustomMessage<{}, {}> {
    /**
     * A message responding that the viewer iframe message is responding to
     */
    action: ViewerCustomAction.response;
}
