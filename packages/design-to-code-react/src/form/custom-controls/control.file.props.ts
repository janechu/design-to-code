import { CommonControlConfig } from "../templates";

export interface FileControlStylesheets {
    controlButtonStylesheet: string;
    commonInputStylesheet: string;
    commonDefaultFontStylesheet: string;
}

export interface FileControlProps extends CommonControlConfig {
    /**
     * A comma seperated list of accepted file types.
     * Example: ".jpg,.png,.gif"
     */
    accept: string;

    /**
     * Web component stylesheet paths
     */
    stylesheets: FileControlStylesheets;
}
