export default {
    $schema: "http://json-schema.org/schema#",
    $id: "typeObjectAdditionalPropertiesAsObject",
    title: "Object with additional properties",
    type: "object",
    additionalProperties: {
        title: "Additional property",
        type: "boolean"
    }
};
