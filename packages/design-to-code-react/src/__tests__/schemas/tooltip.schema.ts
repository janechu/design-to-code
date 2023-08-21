export default {
    $schema: "http://json-schema.org/schema#",
    $id: "tooltip",
    title: "Component with tooltips",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        labelOnStandardControl: {
            title: "My label 1",
            description: "My label's tooltip 1",
            type: "string",
        },
        labelOnSingleLineControl: {
            title: "My label 2",
            description: "My label's tooltip 2",
            type: "boolean",
        },
    },
};
