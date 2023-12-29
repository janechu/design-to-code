export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlSectionLinkDisabled",
    title: "SectionLink control disabled",
    type: "object",
    properties: {
        nestedObject: {
            title: "Nested object",
            type: "object",
            disabled: true,
        },
    },
};
