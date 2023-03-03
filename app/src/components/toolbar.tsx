import React from "react";
import toolbarTemplate from "static-docs/dist/esm/templates/toolbar/index.js";
import staticDocsStyleTemplate from "static-docs/dist/esm/templates/style/index.js";
import { template as templateResolver, escape, forEach } from "lodash-es";
import toolbarConfig from "../../../build/toolbar-config.json";

const config = {
    ...toolbarConfig,
    links: toolbarConfig.toolbarLinks,
};

const compiledToolbarTemplate = templateResolver(toolbarTemplate, {
    imports: {
        // lodash imports needed for the compiler
        _: {
            forEach,
            escape,
        },
    },
});

const compiledStaticDocsStyleTemplate = templateResolver(staticDocsStyleTemplate);

function createMarkup() {
    return {
        __html: compiledToolbarTemplate(config),
    };
}

function createStyleMarkup() {
    return {
        __html: compiledStaticDocsStyleTemplate(),
    };
}

export function Toolbar() {
    return (
        <React.Fragment>
            <div dangerouslySetInnerHTML={createStyleMarkup()} />
            <div dangerouslySetInnerHTML={createMarkup()} />
        </React.Fragment>
    );
}
