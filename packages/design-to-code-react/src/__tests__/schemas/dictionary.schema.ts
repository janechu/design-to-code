export default {
    $schema: "http://json-schema.org/schema#",
    $id: "dictionary",
    title: "Component with additional properties",
    description: "A test component's schema definition.",
    type: "object",
    propertyTitle: "Item key",
    properties: {
        additionalObjects: {
            title: "A dictionary of objects",
            type: "object",
            additionalProperties: {
                title: "An object",
                type: "object",
                properties: {
                    foo: {
                        type: "string",
                    },
                },
            },
        },
        additionalFalse: {
            title: "A non-dictionary",
            type: "object",
            properties: {},
            additionalProperties: false,
        },
    },
    additionalProperties: {
        title: "String item",
        type: "string",
    },
};
