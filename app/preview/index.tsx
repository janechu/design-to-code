import React from "react";
import { createRoot } from "react-dom/client";

/**
 * Create the root node
 */
const root: HTMLElement = document.getElementById("root");

/**
 * Primary render function for app. Called on store updates
 */
const reactRoot = createRoot(root);
reactRoot.render(<React.Fragment>Viewer</React.Fragment>);
