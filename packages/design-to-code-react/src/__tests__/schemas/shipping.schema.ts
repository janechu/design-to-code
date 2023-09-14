export default {
    $schema: "https://json-schema.org/draft/2019-09/schema",
    $id: "/shipping.schema.json",
    title: "Shipping information",
    type: "object",
    properties: {
        first_name: {
            title: "First Name",
            type: "string"
        },
        last_name: {
            title: "Last Name",
            type: "string"
        },
        street_address: {
            title: "Street",
            type: "string"
        },
        city: {
            title: "City",
            type: "string"
        },
        zip: {
            title: "Zip Code",
            type: "number"
        },
        state: {
            title: "State",
            type: "string",
            enum: [
                "CA",
                "PA",
                "WA"
            ]
        },
        gift_wrap: {
            title: "Wrap this item",
            type: "boolean"
        }
    },
    required: [
        "first_name",
        "last_name",
        "street_address",
        "zip",
        "city",
        "state"
    ]
}