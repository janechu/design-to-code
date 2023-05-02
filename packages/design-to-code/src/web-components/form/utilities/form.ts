import { get, omit } from "lodash-es";
import { CombiningKeyword, getDataFromSchema } from "../../../index.js";

/**
 * Gets the array link data
 */
export function getArrayLinks(data: any): string[] {
    if (Array.isArray(data)) {
        return data.map((item: any, index: number) => {
            const defaultValue: string = `Item ${index + 1}`;

            switch (typeof item) {
                case "object":
                    return item.text || defaultValue;
                case "string":
                    return item;
                default:
                    return defaultValue;
            }
        });
    } else {
        return [];
    }
}

export function isSelect(property: any): boolean {
    return typeof property.enum !== "undefined" && property.enum.length > 0;
}

export function isConst(property: any): boolean {
    return typeof property.const !== "undefined";
}

function getOneOfAnyOfType(schemaSection: any): CombiningKeyword | null {
    return schemaSection.oneOf
        ? CombiningKeyword.oneOf
        : schemaSection.anyOf
        ? CombiningKeyword.anyOf
        : null;
}

function checkIsObjectAndSetType(schemaSection: any): any {
    if (schemaSection.properties && schemaSection.type !== "object") {
        return "object";
    }

    return schemaSection.type;
}

function getArrayExample(schemaSection: any): any[] {
    const example: any = getDataFromSchema(schemaSection.items);

    if (schemaSection.minItems) {
        return new Array(schemaSection.length - 1).fill(example);
    }

    return [example];
}

/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(schema: any, propertyLocation: string): any {
    let schemaSection: any =
        propertyLocation === "" ? schema : get(schema, propertyLocation);
    const oneOfAnyOf: CombiningKeyword | null = getOneOfAnyOfType(schemaSection);

    if (oneOfAnyOf !== null) {
        schemaSection = Object.assign(
            {},
            omit(schemaSection, [oneOfAnyOf]),
            schemaSection[oneOfAnyOf][0]
        );
    }

    schemaSection.type = checkIsObjectAndSetType(schemaSection);

    if (schemaSection.items) {
        return getArrayExample(schemaSection);
    }

    return getDataFromSchema(schemaSection);
}
