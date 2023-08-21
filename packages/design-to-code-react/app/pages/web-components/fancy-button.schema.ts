import { linkedDataSchema, ReservedElementMappingKeyword } from "design-to-code";

export default {
    $schema: "http://json-schema.org/schema#",
    $id: "fancyButton",
    title: "Fancy button",
    [ReservedElementMappingKeyword.mapsToTagName]: "fancy-button",
    description: "A test component's schema definition.",
    type: "object",
    properties: {
        children: {
            title: "Default slot",
            [ReservedElementMappingKeyword.mapsToSlot]: "",
            ...linkedDataSchema,
        },
    },
};
