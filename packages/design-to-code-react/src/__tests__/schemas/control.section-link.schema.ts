export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlSectionLink",
    title: "SectionLink control",
    type: "object",
    properties: {
        nestedObject: {
            title: "Nested object",
            type: "object",
        },
    },
    required: ["nestedObject"],
};
