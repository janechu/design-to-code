import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavigationTestPage } from "./pages/navigation";
import ViewerPage from "./pages/viewer";
import ViewerContentPage from "./pages/viewer/content";
import { FormAndNavigationTestPage } from "./pages/form-and-navigation";
import { WebComponentTestPage } from "./pages/web-components";
import WebComponentViewerContent from "./pages/web-components/web-component-viewer-content";
import { FormTestPage } from "./pages/form";
import { IndexPage } from "./pages/index";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<IndexPage />} />
                    <Route path={"/navigation"} element={<NavigationTestPage />} />
                    <Route path={"/viewer"} element={<ViewerPage />} />
                    <Route path={"/viewer/content"} element={<ViewerContentPage />} />
                    <Route path={"/form"} element={<FormTestPage />} />
                    <Route
                        path={"/form-and-navigation"}
                        element={<FormAndNavigationTestPage />}
                    />
                    <Route path={"/web-components"} element={<WebComponentTestPage />} />
                    <Route
                        path={"/web-components/content"}
                        element={<WebComponentViewerContent />}
                    />
                    <Route path={"/"} element={<Navigate to={"/form"} />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
