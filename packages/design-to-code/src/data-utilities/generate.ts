import { get } from "lodash-es";
import { CombiningKeyword, DataType, PropertyKeyword } from "./types.js";
import { normalizeURIToDotNotation } from "./location.js";

/**
 * This file contains all functionality for generating data
 */

const exampleString: string = "example text";

function isOneOfAnyOf(schema: any): boolean {
    return schema[CombiningKeyword.oneOf] || schema[CombiningKeyword.anyOf];
}

function isObjectDataType(schema: any): boolean {
    return schema.type === DataType.object || schema[PropertyKeyword.properties];
}

function hasExample(examples: any[]): boolean {
    return Array.isArray(examples) && examples.length > 0;
}

function hasRequired(schema: any): boolean {
    return Array.isArray(schema.required) && schema.required.length > 0;
}

function hasEnum(schema: any): boolean {
    return Array.isArray(schema.enum);
}

function hasConst(schema: any): boolean {
    return typeof schema.const !== "undefined";
}

/**
 * If there is a default value or example values,
 * return a value to use
 */
function getDefaultOrExample(schema: any): any | void {
    if (typeof schema.default !== "undefined") {
        return schema.default;
    }

    if (hasExample(schema.examples)) {
        return schema.examples[0];
    }

    if (hasEnum(schema)) {
        return schema.enum[0];
    }

    if (hasConst(schema)) {
        return schema.const;
    }
}

/**
 * Resolves a schema from a $ref
 */
function getSchemaFromRef(baseSchema: any, schema: any): any {
    if ((schema.$ref as string).startsWith("#/$defs/")) {
        return get(baseSchema, normalizeURIToDotNotation(schema.$ref));
    }

    return schema;
}

/**
 * Resolve data from a schema
 */
function resolveDataFromSchema(baseSchema: any, schema: any) {
    if (isOneOfAnyOf(schema)) {
        const oneOfAnyOf: CombiningKeyword =
            schema[CombiningKeyword.oneOf] !== undefined
                ? CombiningKeyword.oneOf
                : CombiningKeyword.anyOf;

        return schema[oneOfAnyOf][0]
            ? resolveDataFromSchema(baseSchema, schema[oneOfAnyOf][0])
            : undefined;
    }

    if (typeof schema.$ref === "string") {
        return resolveDataFromSchema(baseSchema, getSchemaFromRef(baseSchema, schema));
    }

    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    return getDataFromSchemaByDataType(baseSchema, schema);
}

/**
 * Gets a single example from a schema
 */
function getDataFromSchema(schema: any): any {
    return resolveDataFromSchema(schema, schema);
}

/**
 * Gets an example by the type of data
 */
function getDataFromSchemaByDataType(baseSchema: any, schema: any): any {
    const defaultOrExample: any = getDefaultOrExample(schema);

    if (typeof defaultOrExample !== "undefined") {
        return defaultOrExample;
    }

    if (isObjectDataType(schema)) {
        const exampleData: any = {};

        if (hasRequired(schema)) {
            for (const requiredItem of schema.required) {
                exampleData[requiredItem] = resolveDataFromSchema(
                    baseSchema,
                    schema[PropertyKeyword.properties][requiredItem]
                );
            }
        }

        return exampleData;
    }

    switch (schema.type) {
        case DataType.array: {
            const arrayData: any[] = [];
            const minItems: number = schema.minItems ? schema.minItems : 2;

            for (let i: number = 0; i < minItems; i++) {
                arrayData.push(resolveDataFromSchema(baseSchema, schema.items));
            }

            return arrayData;
        }
        case DataType.boolean:
            return true;
        case DataType.null:
            return null;
        case DataType.string:
            return exampleString;
        case DataType.number:
            return Math.round(Math.random() * 100);
    }
}

export { getDataFromSchema };
