export default {
    $schema: "http://json-schema.org/schema#",
    $id: "controlPluginCssWithOverrides",
    title: "Component with custom CSS controls with overrides",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        cssWithOverrides: {
            title: "CSS with overrides",
            type: "string",
            formControlId: "custom-controls/css-with-overrides",
        },
    },
};
