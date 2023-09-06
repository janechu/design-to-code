const versions = require("./versions.json");
const dtcPackageName = "design-to-code";
const dtcReactPackageName = "design-to-code-react";

/**
 * See https://janechu.github.io/static-docs/docs/configuration/
 * For SideBarConfig type, this is imported by the "build/generate-docs"
 */
module.exports = {
    links: [
        {
            type: "doc",
            label: "Introduction",
            path: "introduction",
        },
        {
            type: "category",
            label: "JSON schema",
            description:
                "The underlying functionality of the project relies on JSON schema. This is used for generating HTML form elements and validation.",
            path: "json-schema",
            items: [
                {
                    type: "doc",
                    label: "Support",
                    path: "json-schema/support",
                },
                {
                    type: "doc",
                    label: "Draft 2019-09 (formerly known as Draft 8)",
                    path: "json-schema/2019-09",
                },
            ],
        },
        {
            type: "category",
            label: "Message System",
            description:
                "A web worker that serves as the fundamental backbone to the FAST tooling project.",
            path: "message-system",
            items: [
                {
                    type: "doc",
                    label: "Introduction",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system/introduction`,
                },
                {
                    type: "doc",
                    label: "Messages",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system/messages`,
                },
                {
                    type: "doc",
                    label: "Data Format",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system/data-format`,
                },
            ],
        },
        {
            type: "category",
            label: "React Components",
            description:
                "A set of React components that can be registered with the Message System.",
            path: "react-components",
            items: [
                {
                    type: "doc",
                    label: "Form",
                    path: `design-to-code-react/${versions[dtcReactPackageName].versions[0]}/components/form`,
                },
                {
                    type: "doc",
                    label: "Navigation",
                    path: `design-to-code-react/${versions[dtcReactPackageName].versions[0]}/components/navigation`,
                },
                {
                    type: "doc",
                    label: "Viewer",
                    path: `design-to-code-react/${versions[dtcReactPackageName].versions[0]}/components/viewer`,
                },
            ],
        },
        {
            type: "category",
            label: "Web Components",
            description:
                "A set of FAST-based web components that can be registered with the Message System.",
            path: "web-components",
            items: [
                {
                    type: "doc",
                    label: "Color Picker",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/color-picker`,
                },
                {
                    type: "doc",
                    label: "CSS Box Model",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/css-box-model`,
                },
                {
                    type: "doc",
                    label: "CSS Layout",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/css-layout`,
                },
                {
                    type: "doc",
                    label: "File",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/file`,
                },
                {
                    type: "doc",
                    label: "HTML Render",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/html-render`,
                },
                {
                    type: "doc",
                    label: "Units Text Field",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/components/units-text-field`,
                },
            ],
        },
        {
            type: "category",
            label: "Message System Services",
            description:
                "A set of class-based services that can be registered with the Message System.",
            path: "message-system-services",
            items: [
                {
                    type: "doc",
                    label: "Shortcuts",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system-services/shortcuts`,
                },
                {
                    type: "doc",
                    label: "Monaco Editor",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system-services/monaco-editor`,
                },
                {
                    type: "doc",
                    label: "Data Validation",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system-services/data-validation`,
                },
                {
                    type: "doc",
                    label: "Create a Service",
                    path: `design-to-code/${versions[dtcPackageName].versions[0]}/message-system-services/create-a-service`,
                },
            ],
        },
    ],
};
