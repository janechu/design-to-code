import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { NavigationTestPage } from "./pages/navigation";
import ViewerPage from "./pages/viewer";
import ViewerContentPage from "./pages/viewer/content";
import { FormTestPage } from "./pages/form";
import { FormAndNavigationTestPage } from "./pages/form-and-navigation";
import { WebComponentTestPage } from "./pages/web-components";
import WebComponentViewerContent from "./pages/web-components/web-component-viewer-content";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <div>
                    {this.renderLinks()}
                    <Routes>
                        <Route path={"/navigation"} element={<NavigationTestPage />} />
                        <Route path={"/viewer"} element={<ViewerPage />} />
                        <Route path={"/viewer/content"} element={<ViewerContentPage />} />
                        <Route path={"/form"} element={<FormTestPage />} />
                        <Route
                            path={"/form-and-navigation"}
                            element={<FormAndNavigationTestPage />}
                        />
                        <Route
                            path={"/web-components"}
                            element={<WebComponentTestPage />}
                        />
                        <Route
                            path={"/web-components/content"}
                            element={<WebComponentViewerContent />}
                        />
                        <Route path={"/"} element={<Navigate to={"/form"} />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }

    private renderLinks(): React.ReactNode {
        if (window.location.pathname.slice(-7) !== "content") {
            return (
                <React.Fragment>
                    <ul>
                        <li>
                            <Link to="/form">Form</Link>
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
                    <hr />
                </React.Fragment>
            );
        }
    }
}

export default App;
