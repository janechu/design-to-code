import React from "react";
import { FormCategoryDictionary, FormState } from "../../form.props";
import {
    CategoryState,
    SectionControlProps,
    SectionControlState,
} from "../type/control.section.props";
import { get, omit } from "lodash-es";
import {
    CombiningKeyword,
    DataDictionary,
    getDataFromSchema,
    normalizeDataLocationToDotNotation,
    ValidationError,
} from "design-to-code";
import stringify from "fast-json-stable-stringify";

const containsInvalidDataMessage: string = "Contains invalid data";

/**
 * Gets the array link data
 */
export function getArrayLinks(data: any, displayTextDataLocation?: string): string[] {
    if (Array.isArray(data)) {
        return data.map((item: any, index: number) => {
            const displayTextByDataLocation = get(item, displayTextDataLocation);
            let displayText: string =
                typeof displayTextDataLocation === "undefined" ||
                typeof displayTextByDataLocation === "undefined"
                    ? `Item ${index + 1}`
                    : typeof displayTextByDataLocation === "string"
                    ? displayTextByDataLocation
                    : displayTextByDataLocation.toString();

            switch (typeof item) {
                case "string":
                    return item;
                default:
                    return displayText;
            }
        });
    } else {
        return [];
    }
}

function getArrayExample(baseSchema: any, schemaSection: any): any[] {
    const example: any = getDataFromSchema(baseSchema, schemaSection.items);

    if (schemaSection.minItems) {
        return new Array(schemaSection.length - 1).fill(example);
    }

    return [example];
}

function checkIsObjectAndSetType(schemaSection: any): any {
    if (schemaSection.properties && schemaSection.type !== "object") {
        return "object";
    }

    return schemaSection.type;
}

function getOneOfAnyOfType(schemaSection: any): CombiningKeyword | null {
    return schemaSection.oneOf
        ? CombiningKeyword.oneOf
        : schemaSection.anyOf
        ? CombiningKeyword.anyOf
        : null;
}

/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(
    baseSchema: any,
    schema: any,
    propertyLocation: string
): any {
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
        return getArrayExample(baseSchema, schemaSection);
    }

    return getDataFromSchema(baseSchema, schemaSection);
}

export function checkIsDifferentSchema(currentSchema: any, nextSchema: any): boolean {
    return JSON.stringify(nextSchema) !== JSON.stringify(currentSchema);
}

export function getData(location: string, data: any): any {
    return isRootLocation(location) ? data : get(data, location);
}

export function isSelect(property: any): boolean {
    return typeof property.enum !== "undefined" && property.enum.length > 0;
}

export function isConst(property: any): boolean {
    return typeof property.const !== "undefined";
}

export function getLabel(label: string, title: string): string {
    return label === "" && title !== void 0 ? title : label;
}

export const propsKeyword: string = "props";

export enum PropertyKeyword {
    properties = "properties",
}

export interface NavigationItemConfig {
    dataLocation: string;
    schemaLocation: string;
    schema: any;
    data: any;
    default: any;
}

/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location: string): boolean {
    return location === "";
}

/**
 * Gets the validation error message using a data location
 */
export function getErrorFromDataLocation(
    dataLocation: string,
    validationErrors: ValidationError[]
): string {
    let error: string = "";

    if (Array.isArray(validationErrors)) {
        const normalizedDataLocation: string =
            normalizeDataLocationToDotNotation(dataLocation);

        for (const validationError of validationErrors) {
            if (normalizedDataLocation === validationError.dataLocation) {
                error = validationError.invalidMessage;
            } else {
                let containsInvalidData: boolean;

                if (normalizedDataLocation === "") {
                    containsInvalidData = true;
                } else {
                    const dataLocations: string[] =
                        validationError.dataLocation.split(".");

                    containsInvalidData = dataLocations.some(
                        (value: string, index: number) => {
                            return (
                                normalizedDataLocation ===
                                dataLocations.slice(0, index + 1).join(".")
                            );
                        }
                    );
                }

                if (error === "" && containsInvalidData) {
                    error = containsInvalidDataMessage;
                }
            }
        }
    }

    return error;
}

export function isDefault<T>(value: T | void, defaultValue: T | void): boolean {
    return typeof value === "undefined" && typeof defaultValue !== "undefined";
}

export function getCategoryStateFromCategoryDictionary(
    categoryDictionary: FormCategoryDictionary,
    dataDictionary: DataDictionary<unknown>,
    dictionaryId: string,
    dataLocation: string
): CategoryState[] {
    return categoryDictionary &&
        categoryDictionary[dataDictionary[0][dictionaryId].schemaId] &&
        categoryDictionary[dataDictionary[0][dictionaryId].schemaId][dataLocation]
        ? categoryDictionary[dataDictionary[0][dictionaryId].schemaId][dataLocation].map(
              category => {
                  return {
                      expanded: !!(category.expandByDefault !== false),
                  };
              }
          )
        : [];
}

export function getUpdatedCategories(
    categories: CategoryState[] = [],
    index?: number
): CategoryState[] {
    const updatedCategories = [].concat(categories);

    if (index !== undefined) {
        updatedCategories[index].expanded = !updatedCategories[index].expanded;
    }

    return updatedCategories;
}

export function updateControlSectionState(
    props: SectionControlProps,
    state?: SectionControlState
): SectionControlState {
    return {
        schema: props.schema,
        oneOfAnyOf: props.navigation[props.navigationConfigId].schema[
            CombiningKeyword.anyOf
        ]
            ? {
                  type: CombiningKeyword.anyOf,
                  activeIndex: -1,
              }
            : props.navigation[props.navigationConfigId].schema[CombiningKeyword.oneOf]
            ? {
                  type: CombiningKeyword.oneOf,
                  activeIndex: -1,
              }
            : null,
        categories:
            state !== undefined && props.schema.$id === state.schema.$id
                ? getUpdatedCategories(state.categories)
                : getCategoryStateFromCategoryDictionary(
                      props.categories,
                      props.dataDictionary,
                      props.dictionaryId,
                      props.dataLocation
                  ),
    };
}

/**
 * Gets the options for a oneOf/anyOf select
 */
export function getOneOfAnyOfSelectOptions(schema: any, state: any): React.ReactNode {
    return schema[state.oneOfAnyOf.type].map(
        (oneOfAnyOfOption: any, index: number): React.ReactNode => {
            return (
                <option key={index} value={index}>
                    {get(oneOfAnyOfOption, "title") ||
                        get(oneOfAnyOfOption, "description") ||
                        "No title"}
                </option>
            );
        }
    );
}
