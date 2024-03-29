export default {
    $schema: "http://json-schema.org/schema#",
    $id: "customControl",
    title: "Component with custom controls",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        file: {
            title: "File",
            type: "string",
            formControlId: "custom-controls/file",
        },
        textAlign: {
            title: "Text align",
            type: "string",
            enum: ["left", "center", "right", "justify"],
            formControlId: "custom-controls/textAlign",
        },
        align: {
            title: "Align",
            type: "string",
            enum: ["top", "center", "bottom"],
            formControlId: "custom-controls/align",
        },
        fileUpload: {
            title: "File upload",
            type: "string",
            formControlId: "custom-controls/fileUpload",
        },
        theme: {
            title: "Theme",
            type: "string",
            enum: ["light", "dark"],
            formControlId: "custom-controls/theme",
        },
    },
};
