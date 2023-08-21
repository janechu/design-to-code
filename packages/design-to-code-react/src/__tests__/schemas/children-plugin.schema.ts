import { linkedDataSchema } from "design-to-code";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "children-with-react-props",
    title: "Component with custom properties ",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        boolean: {
            title: "Boolean",
            type: "boolean",
            pluginId: "boolean-plugin-resolver",
        },
        array: {
            title: "Array of strings",
            type: "array",
            pluginId: "array-plugin-resolver",
            items: {
                title: "String",
                type: "string",
            },
        },
        arrayObject: {
            title: "Array of objects",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    content: {
                        ...linkedDataSchema,
                        pluginId: "children-plugin-resolver",
                    },
                },
            },
        },
        render: {
            ...linkedDataSchema,

            pluginId: "children-plugin-resolver",
        },
    },
};
