export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlSectionLinkDefault",
    title: "SectionLink control with default",
    type: "object",
    properties: {
        nestedObject: {
            title: "Nested object",
            type: "object",
            default: {}
        }
    }
};
