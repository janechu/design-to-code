import { get } from "lodash-es";
import {
    CombiningKeyword,
    DataType,
    itemsKeyword,
    PropertyKeyword,
} from "../data-utilities/types.js";
import { normalizeURIToDotNotation } from "../data-utilities/location.js";
import {
    NavigationConfig,
    NavigationConfigDictionary,
    TreeNavigation,
} from "./navigation.props.js";
import { SchemaDictionary } from "./schema.props.js";
import { DataDictionary, Parent } from "./data.props.js";

function getNavigationRecursive(
    schema: any,
    schemaId: string,
    schemaDictionary: SchemaDictionary,
    disabled: boolean,
    displayTextDataLocation?: string,
    data?: any,
    dictionaryParent?: Parent,
    dataLocation: string = "",
    schemaLocation: string = "",
    parent: string | null = null,
    id?: string
): NavigationConfig {
    const self: string = id || dataLocation;
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    const items: NavigationConfig[] = getNavigationItems(
        schema,
        schemaId,
        schemaDictionary,
        disabled,
        data,
        dataLocation,
        schemaLocation,
        schema.$ref ? parent : self,
        displayTextDataLocation
    );
    const text: string =
        typeof displayTextDataLocation === "string"
            ? get(data, displayTextDataLocation, schema.title)
            : schema.title;

    if (items[self]) {
        return [
            {
                ...items.reduce(
                    (accum: TreeNavigation, item: NavigationConfig): TreeNavigation => {
                        return { ...accum, ...item[0] };
                    },
                    {}
                ),
            },
            self,
        ];
    }

    return [
        {
            [self]: {
                self,
                // ensure the root dictionary item always has a null parent
                // in the event that there is a root level $ref is present
                parent: self === "" ? null : parent,
                parentDictionaryItem:
                    dictionaryParent !== undefined
                        ? {
                              id: dictionaryParent.id,
                              dataLocation: dictionaryParent.dataLocation,
                          }
                        : undefined,
                relativeDataLocation: dataLocation,
                schemaLocation,
                schema,
                disabled,
                data,
                text,
                type: schema.type || DataType.unknown,
                items: items.map((item: NavigationConfig) => {
                    return item[1];
                }),
            },
            ...items.reduce(
                (accum: TreeNavigation, item: NavigationConfig): TreeNavigation => {
                    return { ...accum, ...item[0] };
                },
                {}
            ),
        },
        self,
    ];
}

export function getNavigation(
    schema: any,
    schemaId: string,
    schemaDictionary: SchemaDictionary,
    data?: any,
    parent?: Parent,
    displayTextDataLocation?: string
): NavigationConfig {
    return getNavigationRecursive(
        schema,
        schemaId,
        schemaDictionary,
        !!schema.disabled,
        displayTextDataLocation,
        data,
        parent
    );
}

export function getNavigationDictionary(
    schemaDictionary: SchemaDictionary,
    data: DataDictionary<unknown>,
    displayTextDataLocation?: string
): NavigationConfigDictionary {
    const navigationConfigs: NavigationConfigDictionary[] = [];

    Object.keys(data[0]).forEach((dataKey: string) => {
        navigationConfigs.push([
            {
                [dataKey]: getNavigation(
                    schemaDictionary[data[0][dataKey].schemaId],
                    data[0][dataKey].schemaId,
                    schemaDictionary,
                    data[0][dataKey].data,
                    data[0][dataKey].parent,
                    displayTextDataLocation
                ),
            },
            dataKey,
        ]);
    });

    return [
        navigationConfigs.reduce(
            (
                accum: { [key: string]: NavigationConfig },
                navigationConfig: NavigationConfigDictionary
            ) => {
                accum[navigationConfig[1]] = navigationConfig[0][navigationConfig[1]];

                return accum;
            },
            {}
        ),
        data[1],
    ];
}

function getNavigationItems(
    schema: any,
    schemaId: string,
    schemaDictionary: SchemaDictionary,
    disabled: boolean,
    data: any,
    dataLocation: string,
    schemaLocation: string,
    parent: string,
    displayTextDataLocation: string
): NavigationConfig[] {
    const combiningKeyword: CombiningKeyword | void = schema[CombiningKeyword.oneOf]
        ? CombiningKeyword.oneOf
        : schema[CombiningKeyword.anyOf]
        ? CombiningKeyword.anyOf
        : void 0;

    if (combiningKeyword) {
        return schema[combiningKeyword].map((subSchema: any, index: number) => {
            const schemaLocationIsRoot: boolean = schemaLocation === "";
            const currentSchemaLocation: string = schemaLocationIsRoot
                ? `${combiningKeyword}[${index}]`
                : `${schemaLocation}.${combiningKeyword}[${index}]`;
            const currentId: string = `${dataLocation}{${schemaLocation}${
                schemaLocationIsRoot ? "" : "."
            }${combiningKeyword}[${index}]}`;

            return getNavigationRecursive(
                subSchema,
                schemaId,
                schemaDictionary,
                disabled || !!subSchema.disabled,
                displayTextDataLocation,
                data,
                undefined,
                dataLocation,
                currentSchemaLocation,
                parent,
                currentId
            );
        });
    }

    switch (schema.type) {
        case DataType.object:
            if (schema.properties) {
                return Object.keys(schema.properties).map((propertyKey: string) => {
                    return getNavigationRecursive(
                        schema.properties[propertyKey],
                        schemaId,
                        schemaDictionary,
                        disabled || !!schema.properties[propertyKey].disabled,
                        displayTextDataLocation,
                        get(data, propertyKey) ? data[propertyKey] : void 0,
                        undefined,
                        dataLocation ? `${dataLocation}.${propertyKey}` : propertyKey,
                        schemaLocation
                            ? `${schemaLocation}.${PropertyKeyword.properties}.${propertyKey}`
                            : `${PropertyKeyword.properties}.${propertyKey}`,
                        parent
                    );
                });
            }
        case DataType.array:
            if (schema.items && Array.isArray(data)) {
                return data.map((value: any, index: number) => {
                    return getNavigationRecursive(
                        schema.items,
                        schemaId,
                        schemaDictionary,
                        disabled || !!schema.items.disabled,
                        displayTextDataLocation,
                        data[index],
                        undefined,
                        `${dataLocation}[${index}]`,
                        schemaLocation
                            ? `${schemaLocation}.${itemsKeyword}`
                            : `${itemsKeyword}`,
                        parent
                    );
                });
            }
        default:
        case DataType.unknown:
            if (schema.$ref) {
                // relative $ref
                if (schema.$ref.startsWith("#")) {
                    return [
                        getNavigationRecursive(
                            get(
                                schemaDictionary[schemaId],
                                normalizeURIToDotNotation(schema.$ref)
                            ),
                            schemaId,
                            schemaDictionary,
                            disabled,
                            displayTextDataLocation,
                            data,
                            undefined,
                            dataLocation,
                            normalizeURIToDotNotation(schema.$ref),
                            parent
                        ),
                    ];
                }
            }
    }

    return [];
}
