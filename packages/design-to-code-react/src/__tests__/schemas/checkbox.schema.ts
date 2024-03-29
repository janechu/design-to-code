export default {
    $schema: "http://json-schema.org/schema#",
    $id: "checkbox",
    title: "Component with checkbox",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        toggle: {
            title: "Required Checkbox",
            type: "boolean",
        },
        optionalToggle: {
            title: "Optional Checkbox",
            type: "boolean",
        },
        defaultToggle: {
            title: "Default Checkbox",
            type: "boolean",
            default: true,
        },
        disabledToggle: {
            title: "Disabled Checkbox",
            type: "boolean",
            disabled: true,
        },
    },
    required: ["toggle"],
};
