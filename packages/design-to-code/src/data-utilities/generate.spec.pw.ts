import { expect, test } from "@playwright/test";
import { getDataFromSchema } from "./generate.js";

/**
 * Gets an example from a schema
 */
test.describe("getDataFromSchema", () => {
    test("should return a default even if no type has been specified", () => {
        const schema: any = {
            default: "foo",
        };

        expect(getDataFromSchema(schema, schema)).toEqual("foo");
    });
    test("should return the first example from the examples array", () => {
        const schema: any = {
            examples: ["bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toEqual("bar");
    });
    test("should not return an example if a default is available", () => {
        const schema: any = {
            default: "foo",
            examples: ["bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return an enum value", () => {
        const schema: any = {
            enum: ["foo", "bar"],
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return a const value", () => {
        const schema: any = {
            const: "foo",
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return a string", () => {
        const schema: any = {
            type: "string",
        };

        expect(typeof getDataFromSchema(schema)).toEqual("string");

        const schemaWithDefault: any = {
            type: "string",
            default: "foo",
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toEqual("string");
        expect(getDataFromSchema(schemaWithDefault)).toEqual("foo");
    });
    test("should return a boolean", () => {
        const schema: any = {
            type: "boolean",
        };

        expect(typeof getDataFromSchema(schema)).toEqual("boolean");

        const schemaWithDefault: any = {
            type: "boolean",
            default: false,
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toEqual("boolean");
        expect(getDataFromSchema(schemaWithDefault)).toEqual(false);
    });
    test("should return a number", () => {
        const schema: any = {
            type: "number",
        };

        expect(typeof getDataFromSchema(schema)).toEqual("number");

        const schemaWithDefault: any = {
            type: "number",
            default: 1,
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toEqual("number");
        expect(getDataFromSchema(schemaWithDefault)).toEqual(1);
    });
    test("should return null", () => {
        const schema: any = {
            type: "null",
        };

        expect(getDataFromSchema(schema)).toEqual(null);
    });
    test("should return an enum specified value", () => {
        const schema: any = {
            enum: ["foo", "bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return default even if enums are specified", () => {
        const schema: any = {
            enum: ["foo", "bar", "bat"],
            default: "bat",
        };

        expect(getDataFromSchema(schema)).toEqual("bat");
    });
    test("should return an array", () => {
        const schema: any = {
            type: "array",
            items: {
                type: "string",
            },
        };

        const exampleData: any = getDataFromSchema(schema);

        expect(Array.isArray(exampleData)).toEqual(true);
        expect(exampleData).toHaveLength(0);
    });
    test("should return an empty object", () => {
        const schemaWithObjectTypeAndProperties: any = {
            type: "object",
            properties: {},
        };

        const schemaWithObjectTypeAndPropertiesExampleData: any = getDataFromSchema(
            schemaWithObjectTypeAndProperties
        );

        expect(schemaWithObjectTypeAndPropertiesExampleData).toMatchObject({});

        const schemaWithObjectType: any = {
            type: "object",
        };

        const schemaWithObjectTypeExampleData: any =
            getDataFromSchema(schemaWithObjectType);

        expect(schemaWithObjectTypeExampleData).toMatchObject({});

        const schemaWithProperties: any = {
            properties: {},
        };

        const schemaWithPropertiesExampleData: any =
            getDataFromSchema(schemaWithProperties);

        expect(schemaWithPropertiesExampleData).toMatchObject({});

        const schemaWithOptionalProperties: any = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
        };

        const schemaWithOptionalPropertiesExampleData: any = getDataFromSchema(
            schemaWithOptionalProperties
        );

        expect(schemaWithOptionalPropertiesExampleData).toMatchObject({});
    });
    test("should return data corresponding to an anyOf", () => {
        const schemaWithAnyOf: any = {
            anyOf: [
                {
                    type: "string",
                    default: "bar",
                },
                {
                    type: "string",
                    default: "foo",
                },
            ],
        };

        expect(getDataFromSchema(schemaWithAnyOf)).toEqual("bar");
    });
    test("should return data corresponding to a oneOf", () => {
        const schemaWithOneOf: any = {
            oneOf: [
                {
                    type: "string",
                    default: "foo",
                },
                {
                    type: "string",
                    default: "bar",
                },
            ],
        };

        expect(getDataFromSchema(schemaWithOneOf)).toEqual("foo");
    });
    test("should return data when the schema contains nested oneOfs", () => {
        const schemaWithNestedOneOfs: any = {
            type: "object",
            properties: {
                foo: {
                    oneOf: [
                        {
                            type: "string",
                        },
                        {
                            type: "boolean",
                        },
                    ],
                },
                bar: {
                    type: "boolean",
                },
            },
            required: ["foo", "bar"],
        };

        expect(getDataFromSchema(schemaWithNestedOneOfs)).toMatchObject({});
    });
    test("should return data when the schema references a definition", () => {
        const schemaWithDefinition: any = {
            $schema: "http://json-schema.org/schema#",
            $id: "https://example.com/schemas/customer",
            id: "definitions",
            title: "A schema with definitions",
            type: "object",
            properties: {
                a: { $ref: "#/$defs/name" },
                b: { $ref: "#/$defs/name" },
            },
            required: ["a", "b"],
            $defs: {
                name: { type: "string" },
            },
        };

        expect(
            getDataFromSchema(schemaWithDefinition, schemaWithDefinition.properties.a)
        ).toEqual("");
    });
    test("should generate from a recursive definition which includes a oneOf", () => {
        const schemaWithDefinition: any = {
            $schema: "http://json-schema.org/schema#",
            $id: "https://example.com/schemas/customer",
            title: "A schema with definitions",
            $ref: "#/$defs/names",
            $defs: {
                name: {
                    type: "object",
                    properties: {
                        first: {
                            type: "string",
                        },
                        last: {
                            oneOf: [
                                {
                                    type: "object",
                                    properties: {
                                        array: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    name: {
                                                        $ref: "#/$defs/questions",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    required: ["array"],
                                },
                            ],
                        },
                    },
                    required: ["first", "last"],
                },
                names: {
                    title: "names",
                    type: "array",
                    items: {
                        $ref: "#/$defs/name",
                    },
                },
            },
        };

        const exampleData = getDataFromSchema(schemaWithDefinition);
        expect(Array.isArray(exampleData)).toEqual(true);
        expect(exampleData).toHaveLength(0);
    });
});
