/**
 * This file generates the guidance files for web components
 * titled packages/design-to-code/src/web-components/*-guidance
 *
 * Requirements for guidance web components:
 * 1. Markdown files (no nesting) in a folder named "guidance"
 *    in the guidance specific web component
 *    e.g. packages/design-to-code/src/web-components/*-guidance/guidance/*.md
 * 2. Add the name of the web component folder to the array const in this file
 * 3. To generate a guidance title, add in the following to the markdown file:
 *    <!-- title: <My Guidance Document Title> -->
 */

const { globSync } = require("glob");
const { marked } = require("marked");
const path = require("path");
const fs = require("fs");

const guidanceWebComponents = ["form-guidance"];

const getGuidanceWebComponentPath = function (name) {
    return path.resolve(
        __dirname,
        `../packages/design-to-code/src/web-components/${name}`
    );
};

const getGuidanceWebComponentClass = function (name) {
    const pascalCaseName = toPascalCase(name);
    return `/**
 * DO NOT EDIT - generated from /build/guidance.js
 */
import { FASTElement, } from "@microsoft/fast-element";

export class ${pascalCaseName} extends FASTElement {}
`;
};

const getGuidanceWebComponentTemplate = function (name, guidanceDocuments) {
    const guidanceDocumentHTML = guidanceDocuments
        .map(guidanceDocument => {
            return `<dtc-guidance-document title="${guidanceDocument.title}">${guidanceDocument.html}</dtc-guidance-document>`;
        })
        .reduce((accum, current) => {
            return accum + current;
        }, "");

    return `/**
 * DO NOT EDIT - generated from /build/guidance.js
 */
import { html } from "@microsoft/fast-element";
import { ${toPascalCase(name)} } from "./${name}.js";

export const ${toCamelCase(name)}Template = html<${toPascalCase(name)}>\`
    <dtc-guidance>
        ${guidanceDocumentHTML}
    </dtc-guidance>
\`;
`;
};

const getGuidanceWebComponentDefinition = function (name) {
    const camelCaseName = toCamelCase(name);
    const pascalCaseName = toPascalCase(name);

    return `/**
 * DO NOT EDIT - generated from /build/guidance.js
 */
import { css } from "@microsoft/fast-element";
import { ${camelCaseName}Template } from "./${name}.template.js";
import { ${pascalCaseName} } from "./${name}.js";
import * as Guidance from "../guidance/guidance.define.js";
import * as GuidanceDocument from "../guidance-document/guidance-document.define.js";

// tree-shaking
Guidance;
GuidanceDocument;

${pascalCaseName}.define({
    name: "dtc-${name}",
    template: ${camelCaseName}Template,
    styles: css\`\`,
});
`;
};

function toPascalCase(name) {
    const camelCaseName = toCamelCase(name);
    return camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
}

function toCamelCase(name) {
    return name
        .split("-")
        .map((word, index) => {
            if (index == 0) {
                return word;
            }

            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
}

guidanceWebComponents.forEach(guidanceWebComponent => {
    const guidanceWebComponentPath = getGuidanceWebComponentPath(guidanceWebComponent);
    const documents = globSync(
        `packages/design-to-code/src/web-components/${guidanceWebComponent}/guidance/*.md`
    ).map(markdownFilePath => {
        const titleRegex = new RegExp(/<!-- title: ([A-Za-z|\s]*) -->/);
        const markdown = fs.readFileSync(markdownFilePath, "utf8");
        const html = marked.parse(markdown);
        const title = markdown.match(titleRegex)[1];

        return {
            html,
            title,
        };
    });

    const guidanceWebComponentTemplate = getGuidanceWebComponentTemplate(
        guidanceWebComponent,
        documents
    );
    const guidanceWebComponentClass = getGuidanceWebComponentClass(guidanceWebComponent);
    const guidanceWebComponentDefinition =
        getGuidanceWebComponentDefinition(guidanceWebComponent);

    fs.writeFileSync(
        path.resolve(guidanceWebComponentPath, `${guidanceWebComponent}.template.ts`),
        guidanceWebComponentTemplate
    );
    fs.writeFileSync(
        path.resolve(guidanceWebComponentPath, `${guidanceWebComponent}.ts`),
        guidanceWebComponentClass
    );
    fs.writeFileSync(
        path.resolve(guidanceWebComponentPath, `${guidanceWebComponent}.define.ts`),
        guidanceWebComponentDefinition
    );
});
