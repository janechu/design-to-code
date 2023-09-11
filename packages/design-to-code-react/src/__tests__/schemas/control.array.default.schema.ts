export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlArrayDefault",
    title: "Array control with default",
    type: "array",
    items: {
        title: "Array item",
        type: "string"
    },
    default: [
        "foo",
        "bar"
    ]
};
