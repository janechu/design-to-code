import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
document.body.setAttribute("style", "margin: 0");

/**
 * Primary render function for app. Called on store updates
 */
const reactRoot = createRoot(root);
reactRoot.render(
    <DndProvider backend={HTML5Backend}>
        <App />
    </DndProvider>
);
