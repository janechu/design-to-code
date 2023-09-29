import { displayTextDataLocationKey } from "../../form/controls/control.array";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlArrayDisplayText",
    title: "Array control with display text",
    type: "array",
    [displayTextDataLocationKey]: "text",
    items: {
        title: "Array item",
        type: "object",
        properties: {
            text: {
                title: "Text",
                type: "string"
            },
            number: {
                title: "Number",
                type: "number"
            },
        }
    }
};
