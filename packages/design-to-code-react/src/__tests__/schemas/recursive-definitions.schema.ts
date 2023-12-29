export default {
    $schema: "http://json-schema.org/schema#",
    $id: "definitions",
    title: "A schema with definitions",
    type: "object",
    properties: {
        a: { $ref: "#/$defs/qs" },
    },
    $defs: {
        q: {
            title: "Q",
            type: "object",
            properties: {
                q: {
                    title: "Question",
                    type: "string",
                },
                a: {
                    title: "Answer",
                    oneOf: [
                        {
                            title: "Answer array",
                            type: "object",
                            properties: {
                                oneOf: {
                                    title: "Array of answers",
                                    type: "array",
                                    items: {
                                        title: "Answer obj",
                                        type: "object",
                                        properties: {
                                            value: {
                                                title: "value",
                                                type: "string",
                                            },
                                            q: {
                                                $ref: "#/$defs/qs",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        {
                            title: "Answer string",
                            type: "string",
                        },
                    ],
                },
            },
        },
        qs: {
            title: "Qs",
            type: "array",
            items: {
                $ref: "#/$defs/q",
            },
        },
    },
};
