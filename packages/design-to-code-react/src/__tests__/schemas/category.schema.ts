import { linkedDataSchema } from "design-to-code";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "category",
    title: "Category",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        string: {
            title: "Textarea",
            type: "string",
        },
        boolean: {
            title: "Checkbox",
            type: "boolean",
        },
        enum: {
            title: "Select",
            type: "string",
            enum: ["span", "button"],
        },
        number: {
            title: "Numberfield",
            type: "number",
        },
        object: {
            title: "Object",
            type: "object",
            properties: {
                number: {
                    type: "number",
                },
                string: {
                    type: "string",
                },
            },
        },
        array: {
            title: "Array",
            type: "array",
            items: {
                title: "String item",
                type: "string",
            },
        },
        children: {
            title: "Linked data",
            ...linkedDataSchema,
        },
    },
};
