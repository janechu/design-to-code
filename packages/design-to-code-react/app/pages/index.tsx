import React from "react";
import { Link } from "react-router-dom";

export function IndexPage() {
    if (window.location.pathname.slice(-7) !== "content") {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/form?schema=text">Form</Link>
                    </li>
                    <li>
                        <Link to="/navigation">Navigation</Link>
                    </li>
                    <li>
                        <Link to="/form-and-navigation">Form and Navigation</Link>
                    </li>
                    <li>
                        <Link to="/viewer">Viewer</Link>
                    </li>
                    <li>
                        <Link to="/web-components">Web Components</Link>
                    </li>
                </ul>
            </nav>
        );
    }

    return null;
}
