import React from "react";
import { Viewer as BaseViewer } from "./viewer.base";
import {
    ViewerCustomAction,
    ViewerHandledProps,
    ViewerProps,
    ViewerUnhandledProps,
} from "./viewer.props";
import cssVariables from "../../style/css-variables.css";
import style from "./viewer.style.css";

// tree-shaking
cssVariables;
style;

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Viewer = BaseViewer;
type Viewer = InstanceType<typeof Viewer>;

export {
    Viewer,
    // When drag and drop becomes available for this component,
    // this export should not include the wrapped DndProvider from react-dnd
    // as it is intended to work with the other Modular prefixed components
    // See: https://github.com/microsoft/fast/issues/2774
    Viewer as ModularViewer,
    ViewerCustomAction,
    ViewerProps,
    ViewerHandledProps,
    ViewerUnhandledProps,
};
