export default {
    $schema: "http://json-schema.org/schema#",
    id: "definitions",
    title: "A schema with definitions",
    type: "object",
    properties: {
        a: { $ref: "#/$defs/text" },
        b: { $ref: "#/$defs/text" },
    },
    required: ["a", "b"],
    $defs: {
        text: { type: "string" },
    },
};
