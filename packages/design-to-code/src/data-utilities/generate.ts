import { get } from "lodash-es";
import { CombiningKeyword, DataType, PropertyKeyword } from "./types.js";
import { normalizeURIToDotNotation } from "./location.js";

/**
 * This file contains all functionality for generating data
 */

function isOneOfAnyOf(schema: any): boolean {
    return schema[CombiningKeyword.oneOf] || schema[CombiningKeyword.anyOf];
}

function isObjectDataType(schema: any): boolean {
    return schema.type === DataType.object || schema[PropertyKeyword.properties];
}

function hasExample(examples: any[]): boolean {
    return Array.isArray(examples) && examples.length > 0;
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
    if ((schema.$ref as string).startsWith("#/")) {
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
    return getDataFromSchemaByDataType(schema);
}

/**
 * Gets a single example from a schema
 * @param baseSchema - the root schema
 * @param schema - a sub schema
 */
function getDataFromSchema(baseSchema: any, schema?: any): any {
    if (schema) {
        return resolveDataFromSchema(baseSchema, schema);
    }

    return resolveDataFromSchema(baseSchema, baseSchema);
}

/**
 * Gets an example by the type of data
 */
function getDataFromSchemaByDataType(schema: any): any {
    const defaultOrExample: any = getDefaultOrExample(schema);

    if (typeof defaultOrExample !== "undefined") {
        return defaultOrExample;
    }

    if (isObjectDataType(schema)) {
        return {};
    }

    switch (schema.type) {
        case DataType.array: {
            return [];
        }
        case DataType.boolean:
            return false;
        case DataType.null:
            return null;
        case DataType.string:
            return "";
        case DataType.number:
            return 0;
    }
}

export { getDataFromSchema };
