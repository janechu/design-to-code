export default {
    general: {
        title: "A general schema",
        $id: "general",
        id: "general",
        type: "object",
        properties: {
            foo: {
                title: "A string",
                type: "string",
            },
            bar: {
                title: "A boolean",
                type: "boolean",
            },
            baz: {
                title: "An enum",
                enum: ["a", "b", "c"],
            },
            foobar: {
                title: "A number",
                type: "number",
            },
        },
    },
};
