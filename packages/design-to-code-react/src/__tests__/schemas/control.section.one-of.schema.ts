export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlSectionOneOf",
    title: "Section control with oneOf",
    oneOf: [
        {
            title: "Object",
            type: "object",
            properties: {},
        },
        {
            title: "String",
            type: "string",
        },
    ],
};
