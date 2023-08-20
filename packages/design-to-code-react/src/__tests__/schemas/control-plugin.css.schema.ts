import { linkedDataSchema } from "design-to-code";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlPluginCss",
    title: "Component with custom CSS controls",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        css: {
            title: "CSS",
            type: "string",
            formControlId: "custom-controls/css",
        },
        object: {
            title: "Nested object",
            type: "object",
            properties: {
                cssWithOverrides2: {
                    title: "CSS 2",
                    type: "string",
                    formControlId: "custom-controls/css",
                },
            },
        },
        children: {
            title: "Children",
            ...linkedDataSchema,
        },
    },
};
