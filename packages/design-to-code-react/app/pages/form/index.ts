export interface ExampleComponent {
    schema: any;
    data?: any;
}

import {
    allControlTypesSchema,
    anyOfSchema,
    arraysSchema,
    badgeSchema,
    categorySchema,
    checkboxSchema,
    childrenSchema,
    constSchema as constKeywordSchema,
    controlArrayDefaultSchema,
    controlArrayDisabledSchema,
    controlArraySchema,
    controlCheckboxDefaultSchema,
    controlCheckboxDisabledSchema,
    controlCheckboxSchema,
    controlDisplayDefaultSchema,
    controlDisplayDisabledSchema,
    controlDisplaySchema,
    controlNumberFieldDefaultSchema,
    controlNumberFieldDisabledSchema,
    controlNumberFieldSchema,
    controlPluginCssSchema,
    controlPluginCssWithOverridesSchema,
    controlSelectDefaultSchema,
    controlSelectDisabledSchema,
    controlSelectSchema,
    controlTextareaDefaultSchema,
    controlTextareaDisabledSchema,
    controlTextareaSchema,
    controlPluginSchema as customControlSchema,
    defaultsSchema,
    definitionsSchema,
    dictionarySchema,
    disabledSchema,
    generalSchema,
    invalidDataSchema,
    mergedOneOfSchema,
    nestedOneOfSchema,
    nullSchema as nullKeywordSchema,
    numberFieldSchema,
    objectsSchema,
    oneOfDeeplyNestedSchema as oneOfArraysSchema,
    oneOfSchema,
    recursiveDefinitionsSchema,
    shippingSchema,
    textareaSchema,
    textSchema,
    tooltipSchema,
} from "../../../src/__tests__/schemas";

export const category: ExampleComponent = {
    schema: categorySchema,
};

export const customControl: ExampleComponent = {
    schema: customControlSchema,
};

export const controlPluginCssWithOverrides: ExampleComponent = {
    schema: controlPluginCssWithOverridesSchema,
};

export const controlPluginCss: ExampleComponent = {
    schema: controlPluginCssSchema,
};

export const definitions: ExampleComponent = {
    schema: definitionsSchema,
};

export const textField: ExampleComponent = {
    schema: textareaSchema,
};

export const text: ExampleComponent = {
    schema: textSchema,
};

export const numberField: ExampleComponent = {
    schema: numberFieldSchema,
};

export const checkbox: ExampleComponent = {
    schema: checkboxSchema,
};

export const anyOf: ExampleComponent = {
    schema: anyOfSchema,
};

export const oneOf: ExampleComponent = {
    schema: oneOfSchema,
};

export const nestedOneOf: ExampleComponent = {
    schema: nestedOneOfSchema,
};

export const mergedOneOf: ExampleComponent = {
    schema: mergedOneOfSchema,
};

export const objects: ExampleComponent = {
    schema: objectsSchema,
};

export const arrays: ExampleComponent = {
    schema: arraysSchema,
};

export const oneOfArrays: ExampleComponent = {
    schema: oneOfArraysSchema,
};

export const children: ExampleComponent = {
    schema: childrenSchema,
};

export const generalExample: ExampleComponent = {
    schema: generalSchema,
};

export const badge: ExampleComponent = {
    schema: badgeSchema,
};

export const constKeyword: ExampleComponent = {
    schema: constKeywordSchema,
};

import InvalidDataDataSet from "../../../src/__tests__/datasets/invalid-data";

export const invalidData: ExampleComponent = {
    schema: invalidDataSchema,
    data: InvalidDataDataSet,
};

export const defaults: ExampleComponent = {
    schema: defaultsSchema,
};

export const nullKeyword: ExampleComponent = {
    schema: nullKeywordSchema,
};

export const allControlTypes: ExampleComponent = {
    schema: allControlTypesSchema,
};

import DictionaryDataSet from "../../../src/__tests__/datasets/dictionary";

export const dictionary: ExampleComponent = {
    schema: dictionarySchema,
    data: DictionaryDataSet,
};

export const tooltip: ExampleComponent = {
    schema: tooltipSchema,
};

export const disabled: ExampleComponent = {
    schema: disabledSchema,
};

export const recursiveDefinitions: ExampleComponent = {
    schema: recursiveDefinitionsSchema,
};

/**
 * Control specific schemas
 */

// Textarea control
export const controlTextarea: ExampleComponent = {
    schema: controlTextareaSchema,
};
export const controlTextareaDefault: ExampleComponent = {
    schema: controlTextareaDefaultSchema,
    data: undefined,
};
export const controlTextareaDisabled: ExampleComponent = {
    schema: controlTextareaDisabledSchema,
};
export const controlTextareaInvalid: ExampleComponent = {
    schema: controlTextareaSchema,
    data: 42,
};
// Checkbox control
export const controlCheckbox: ExampleComponent = {
    schema: controlCheckboxSchema,
};
export const controlCheckboxDefault: ExampleComponent = {
    schema: controlCheckboxDefaultSchema,
    data: undefined,
};
export const controlCheckboxDisabled: ExampleComponent = {
    schema: controlCheckboxDisabledSchema,
};
export const controlCheckboxInvalid: ExampleComponent = {
    schema: controlCheckboxSchema,
    data: "foo",
};
// Select control
export const controlSelect: ExampleComponent = {
    schema: controlSelectSchema,
};
export const controlSelectDefault: ExampleComponent = {
    schema: controlSelectDefaultSchema,
    data: undefined,
};
export const controlSelectDisabled: ExampleComponent = {
    schema: controlSelectDisabledSchema,
};
export const controlSelectInvalid: ExampleComponent = {
    schema: controlSelectSchema,
    data: true,
};
// Array control
export const controlArray: ExampleComponent = {
    schema: controlArraySchema,
};
export const controlArrayDefault: ExampleComponent = {
    schema: controlArrayDefaultSchema,
};
export const controlArrayDisabled: ExampleComponent = {
    schema: controlArrayDisabledSchema,
};
export const controlArrayInvalid: ExampleComponent = {
    schema: controlArraySchema,
    data: "foo",
};
// Number-field control
export const controlNumberField: ExampleComponent = {
    schema: controlNumberFieldSchema,
};
export const controlNumberFieldDisabled: ExampleComponent = {
    schema: controlNumberFieldDisabledSchema,
};
export const controlNumberFieldDefault: ExampleComponent = {
    schema: controlNumberFieldDefaultSchema,
    data: undefined,
};
export const controlNumberFieldInvalid: ExampleComponent = {
    schema: controlNumberFieldSchema,
    data: "foo",
};
// Display control
export const controlDisplay: ExampleComponent = {
    schema: controlDisplaySchema,
};
export const controlDisplayDisabled: ExampleComponent = {
    schema: controlDisplayDisabledSchema,
};
export const controlDisplayDefault: ExampleComponent = {
    schema: controlDisplayDefaultSchema,
    data: undefined,
};
export const controlDisplayInvalid: ExampleComponent = {
    schema: controlDisplaySchema,
    data: "bar",
};

/**
 * Common use case schemas
 */
export const shipping: ExampleComponent = {
    schema: shippingSchema,
};
