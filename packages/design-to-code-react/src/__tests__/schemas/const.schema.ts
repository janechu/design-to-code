export default {
    $schema: "http://json-schema.org/schema#",
    $id: "constKeyword",
    title: "Component with const",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        foo: {
            title: "Required with default",
            type: "string",
            const: "foo",
            default: "default",
        },
        bar: {
            title: "Required without default",
            type: "number",
            const: 40,
        },
        bat: {
            title: "Optional without default",
            type: "boolean",
            const: true,
        },
    },
    required: ["foo", "bar"],
};
