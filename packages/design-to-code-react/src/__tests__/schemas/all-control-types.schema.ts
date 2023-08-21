import { linkedDataSchema } from "design-to-code";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "allControlTypes",
    title: "Component with all control types",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        textarea: {
            title: "textarea",
            type: "string",
        },
        "section-link": {
            title: "section-link",
            type: "object",
        },
        display: {
            title: "display",
            const: "foobar",
        },
        checkbox: {
            title: "checkbox",
            type: "boolean",
        },
        button: {
            title: "button",
            type: "null",
        },
        array: {
            title: "array",
            items: {
                title: "array item",
                type: "string",
            },
        },
        "number-field": {
            title: "number-field",
            type: "number",
        },
        select: {
            title: "select",
            type: "string",
            enum: ["foo", "bar", "bat"],
        },
        children: {
            ...linkedDataSchema,
        },
    },
};
