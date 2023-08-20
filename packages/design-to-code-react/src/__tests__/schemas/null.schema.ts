export default {
    $schema: "http://json-schema.org/schema#",
    $id: "nullKeyword",
    title: "Component with null",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        optionalNull: {
            title: "optional null",
            type: "null",
        },
        requiredNull: {
            title: "required null",
            type: "null",
        },
    },
    required: ["requiredNull"],
};
