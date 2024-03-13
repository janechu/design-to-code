export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlArrayWithEnums",
    title: "Array control with enums",
    type: "array",
    items: {
        title: "Array item",
        enum: [
            "foo",
            "bar"
        ]
    },
};
