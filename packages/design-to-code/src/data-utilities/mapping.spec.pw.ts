import { set } from "lodash-es";
import { expect, test } from "@playwright/test";
import { DataDictionary } from "../message-system/index.js";
import { linkedDataSchema } from "../schemas/index.js";
import {
    mapDataDictionary,
    MapperConfig,
    mapWebComponentDefinitionToJSONSchema,
    ResolverConfig,
} from "./mapping.js";
import { DataType, ReservedElementMappingKeyword } from "./types.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe.only("mapDataDictionary", () => {
    test("should call a passed mapper and resolver function on a single data dictionary item", () => {
        let mapperCalled = 0;
        let resolverCalled = 0;
        const mapper: any = () => {
            mapperCalled++;
        };
        const resolver: any = () => {
            resolverCalled++;
        };

        mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(mapperCalled).toEqual(1);
        expect(resolverCalled).toEqual(1);
    });
    test("should call a passed mapper and resolver function on multiple dictionary items", () => {
        let mapperCalled = 0;
        let resolverCalled = 0;
        const mapper: any = () => {
            mapperCalled++;
        };
        const resolver: any = () => {
            resolverCalled++;
        };

        mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                            children: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "children",
                        },
                        data: {
                            c: "d",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(mapperCalled).toEqual(2);
        expect(resolverCalled).toEqual(2);
    });
    test("should map a single dictionary entry", () => {
        const resolver: any = function (config: ResolverConfig<any>): any {
            const dataBlob = config.dataDictionary[0][config.dataDictionary[1]].data;

            if (config.dataDictionary[0][config.dictionaryId].parent) {
                set(
                    dataBlob as object,
                    config.dataDictionary[0][config.dataDictionary[1]].parent
                        .dataLocation,
                    config.dataDictionary[0][config.parent].data
                );
            }

            return dataBlob;
        };

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper: () => {
                return;
            },
            resolver,
        });

        expect(result).toMatchObject({
            a: "b",
        });
    });
    test("should map multiple dictionary entries", () => {
        const resolver: any = function (config: ResolverConfig<any>): any {
            if (config.dataDictionary[0][config.dictionaryId].parent) {
                set(
                    config.dataDictionary[0][config.parent].data as object,
                    config.dataDictionary[0][config.dictionaryId].parent.dataLocation,
                    config.dataDictionary[0][config.dictionaryId].data
                );

                return config.dataDictionary[0][config.parent].data;
            }

            return config.resolvedData;
        };
        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                            children: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "children",
                        },
                        data: {
                            c: "d",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper: () => {
                return;
            },
            resolver,
        });

        expect(result).toMatchObject({
            a: "b",
            children: {
                c: "d",
            },
        });
    });
});

test.describe.only("htmlMapper", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should map a string to data", async ({ page }) => {
        const textString = "Hello world";
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "text",
                    data: textString,
                },
            },
            "",
        ];
        const textNode = await page.evaluate(
            ([textString]: [string]) => {
                return [
                    document.createTextNode(textString),
                    document.createTextNode(textString).textContent,
                ];
            },
            [textString]
        );
        const mappedTextNode = await page.evaluate(
            ([dataDictionaryAsString]: [string]) => {
                const dataDictionary: DataDictionary<unknown> =
                    JSON.parse(dataDictionaryAsString);
                const dictionaryId = "";
                // This needs to be made globally available on the page for execution
                (window as any).dtc.htmlMapper({
                    version: 1,
                })({
                    dataDictionary,
                    dictionaryId,
                    schema: {
                        id: "text",
                        type: "string",
                    },
                    mapperPlugins: [],
                });

                return [
                    dataDictionary[0][dictionaryId].data,
                    (dataDictionary[0][dictionaryId].data as Node).textContent,
                ];
            },
            [JSON.stringify(dataDictionary)]
        );

        expect(mappedTextNode).toMatchObject(textNode);
    });
    test("should map an element to data", async ({ page }) => {
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: {},
                },
            },
            "",
        ];
        const divNode = await page.evaluate(() => {
            return document.createElement("div").outerHTML;
        });
        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, mapsToTagName]: [string, string]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);

                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "object",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [JSON.stringify(dataDictionary), ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(divNode).toEqual(mappedNode);
    });
    test("should map an element to boolean data", async ({ page }) => {
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: {
                        foo: true,
                        bar: false,
                    },
                },
            },
            "",
        ];
        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, DataTypeBool, mapsToTagName]: [
                string,
                DataType,
                string
            ]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);

                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [
                                {
                                    name: "foo",
                                    description: "The foo property",
                                    type: DataTypeBool,
                                    default: "false",
                                    required: false,
                                },
                                {
                                    name: "bar",
                                    description: "The bar property",
                                    type: DataTypeBool,
                                    default: "false",
                                    required: false,
                                },
                            ],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "object",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [
                JSON.stringify(dataDictionary),
                DataType.boolean,
                ReservedElementMappingKeyword.mapsToTagName,
            ]
        );

        const divNode = await page.evaluate(() => {
            const element = document.createElement("div");
            element.setAttribute("foo", "");

            return element.outerHTML;
        });

        await expect(mappedNode).toEqual(divNode);
    });
    test("should not map an element when that element is not an object", async ({
        page,
    }) => {
        const dataDictionary = [
            {
                "": {
                    schemaId: "foo",
                    data: {},
                },
            },
            "",
        ];
        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, mapsToTagName]: [string, string]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "string",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [JSON.stringify(dataDictionary), ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedNode).toEqual(undefined);
    });
    test("should not map an element when that element is not available", async ({
        page,
    }) => {
        const dataDictionary = [
            {
                "": {
                    schemaId: "foo",
                    data: {},
                },
            },
            "",
        ];
        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, mapsToTagName]: [string, string]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "object",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [JSON.stringify(dataDictionary), ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedNode).toEqual(undefined);
    });
    test("should map an element with an attribute", async ({ page }) => {
        const element = {
            id: "foo",
        };

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            mappedElement.setAttribute("id", "foo");

            return mappedElement.outerHTML;
        });
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: element,
                },
            },
            "",
        ];

        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, mapsToTagName]: [string, string]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "object",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [JSON.stringify(dataDictionary), ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedNode).toEqual(mappedElement);
    });
    test("should map an element with an attribute and ignore any slots", async ({
        page,
    }) => {
        const element = {
            id: "foo",
            Slot: "Hello world",
        };
        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            mappedElement.setAttribute("id", "foo");
            return mappedElement.outerHTML;
        });
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: element,
                },
            },
            "",
        ];
        const mappedNode = await page.evaluate(
            ([dataDictionaryAsString, mapsToTagName, mapsToSlot]: [
                string,
                string,
                string
            ]) => {
                const dataDictionary = JSON.parse(dataDictionaryAsString);
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "div",
                        type: "object",
                        properties: {
                            Slot: {
                                [mapsToSlot]: "",
                            },
                        },
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [
                JSON.stringify(dataDictionary),
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        expect(mappedNode).toEqual(mappedElement);
    });
    test("should map an element nested within another element with a default slot", async ({
        page,
    }) => {
        const result = await page.evaluate(
            ([mapsToTagName, mapsToSlot]: [string, string]) => {
                const mapper: any = (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "button",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                    ],
                });

                const result: any = (window as any).dtc.mapDataDictionary({
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "bat",
                                        },
                                    ],
                                },
                            },
                            bat: {
                                schemaId: "bat",
                                parent: {
                                    id: "foo",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: {
                            id: "foo",
                            [mapsToTagName]: "div",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bar: {
                            id: "bar",
                            [mapsToTagName]: "button",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bat: {
                            id: "bat",
                            type: "string",
                        },
                    },
                    mapper,
                    resolver: (window as any).dtc.htmlResolver,
                });

                return result.outerHTML;
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            const buttonElement = document.createElement("button");
            buttonElement.textContent = "Hello world";
            mappedElement.append(buttonElement);

            return mappedElement.outerHTML;
        });

        expect(result).toEqual(mappedElement);
    });
    test("should map an element nested within another element with a named slot", async ({
        page,
    }) => {
        const result = await page.evaluate(
            ([mapsToTagName, mapsToSlot]: [string, string]) => {
                const mapper: any = (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "button",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                                {
                                    name: "foo",
                                    description: "The foo slot",
                                },
                            ],
                        },
                    ],
                });

                const result: any = (window as any).dtc.mapDataDictionary({
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    SlotFoo: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "SlotFoo",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "bat",
                                        },
                                    ],
                                },
                            },
                            bat: {
                                schemaId: "undefined",
                                parent: {
                                    id: "foo",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: {
                            id: "foo",
                            [mapsToTagName]: "div",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                                SlotFoo: {
                                    [mapsToSlot]: "foo",
                                },
                            },
                        },
                        bar: {
                            id: "bar",
                            [mapsToTagName]: "button",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bat: {
                            id: "bat",
                            type: "string",
                        },
                    },
                    mapper,
                    resolver: (window as any).dtc.htmlResolver,
                });

                return result.outerHTML;
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            const buttonElement = document.createElement("button");
            buttonElement.setAttribute("slot", "foo");
            buttonElement.textContent = "Hello world";
            mappedElement.append(buttonElement);

            return mappedElement.outerHTML;
        });

        await expect(result).toEqual(mappedElement);
    });
    test("should map an element with multiple text strings into a slot", async ({
        page,
    }) => {
        const result = await page.evaluate(
            ([mapsToTagName, mapsToSlot]: [string, string]) => {
                const mapper: any = (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "button",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                    ],
                });

                const result: any = (window as any).dtc.mapDataDictionary({
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                        {
                                            id: "bar",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: "Hello",
                            },
                            bar: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: "world",
                            },
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: {
                            id: "foo",
                            [mapsToTagName]: "button",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bar: {
                            id: "bar",
                            type: "string",
                        },
                    },
                    mapper,
                    resolver: (window as any).dtc.htmlResolver,
                });

                return result.outerHTML;
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("button");
            const text1 = document.createTextNode("Hello");
            const text2 = document.createTextNode("world");
            mappedElement.append(text1);
            mappedElement.append(text2);

            return mappedElement.outerHTML;
        });

        await expect(result).toEqual(mappedElement);
    });
    test("should map an element with mixed text string and element into a slot (1)", async ({
        page,
    }) => {
        const result = await page.evaluate(
            ([mapsToTagName, mapsToSlot]: [string, string]) => {
                const mapper: any = (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "button",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                    ],
                });

                const result: any = (window as any).dtc.mapDataDictionary({
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "bat",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                        {
                                            id: "bar",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                            bar: {
                                schemaId: "foo",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "bat",
                                        },
                                    ],
                                },
                            },
                            bat: {
                                schemaId: "bar",
                                parent: {
                                    id: "bar",
                                    dataLocation: "Slot",
                                },
                                data: "Button",
                            },
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: {
                            id: "foo",
                            [mapsToTagName]: "button",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bar: {
                            id: "bar",
                            type: "string",
                        },
                        bat: {
                            id: "bat",
                            [mapsToTagName]: "div",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                    },
                    mapper,
                    resolver: (window as any).dtc.htmlResolver,
                });

                return result.outerHTML;
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            mappedElement.textContent = "Hello world";
            const buttonElement = document.createElement("button");
            buttonElement.textContent = "Button";
            mappedElement.append(buttonElement);

            return mappedElement.outerHTML;
        });

        await expect(result).toEqual(mappedElement);
    });
    test("should map an element with mixed text string and element into a slot (2)", async ({
        page,
    }) => {
        const result = await page.evaluate(
            ([mapsToTagName, mapsToSlot]: [string, string]) => {
                const mapper: any = (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "button",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                        {
                            name: "div",
                            description: "foobar",
                            attributes: [],
                            slots: [
                                {
                                    name: "",
                                    description: "The default slot",
                                },
                            ],
                        },
                    ],
                });

                const result: any = (window as any).dtc.mapDataDictionary({
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "bat",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                        {
                                            id: "bar",
                                        },
                                        {
                                            id: "bat",
                                        },
                                    ],
                                },
                            },
                            bar: {
                                schemaId: "foo",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: {},
                            },
                            foo: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                            bat: {
                                schemaId: "bar",
                                parent: {
                                    id: "",
                                    dataLocation: "Slot",
                                },
                                data: "Button",
                            },
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: {
                            id: "foo",
                            [mapsToTagName]: "button",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                        bar: {
                            id: "bar",
                            type: "string",
                        },
                        bat: {
                            id: "bat",
                            [mapsToTagName]: "div",
                            type: "object",
                            properties: {
                                Slot: {
                                    [mapsToSlot]: "",
                                },
                            },
                        },
                    },
                    mapper,
                    resolver: (window as any).dtc.htmlResolver,
                });

                return result.outerHTML;
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
            ]
        );

        const mappedElement = await page.evaluate(() => {
            const mappedElement = document.createElement("div");
            const text1 = document.createTextNode("Hello world");
            const buttonElement = document.createElement("button");
            const text2 = document.createTextNode("Button");
            mappedElement.append(text1);
            mappedElement.append(buttonElement);
            mappedElement.append(text2);

            return mappedElement.outerHTML;
        });

        await expect(result).toEqual(mappedElement);
    });
    test("should map an svg element to data", async ({ page }) => {
        const mappedNode = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                const dataDictionary: DataDictionary<any> = [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ];
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "svg",
                            description: "foobar",
                            attributes: [],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "svg",
                        type: "object",
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        const svgNode = await page.evaluate(() => {
            return document.createElementNS("http://www.w3.org/2000/svg", "svg")
                .outerHTML;
        });

        await expect(mappedNode).toEqual(svgNode);
    });
    test("should map an svg element with an attribute specifying a URI to data", async ({
        page,
    }) => {
        const mappedNode = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                const dataDictionary: DataDictionary<any> = [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ];
                (window as any).dtc.htmlMapper({
                    version: 1,
                    tags: [
                        {
                            name: "svg",
                            description: "foobar",
                            attributes: [
                                {
                                    name: "foo",
                                    description: "URI override",
                                    type: "string",
                                    default: "http://www.w3.org/2000/svg",
                                    required: true,
                                },
                            ],
                            slots: [],
                        },
                    ],
                })({
                    dataDictionary,
                    dictionaryId: "",
                    schema: {
                        id: "foo",
                        [mapsToTagName]: "svg",
                        type: "object",
                        properties: {
                            foo: {
                                title: "URI override",
                                type: "string",
                            },
                        },
                    },
                    mapperPlugins: [],
                });

                return dataDictionary[0][""].data.outerHTML;
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        const svgNode = await page.evaluate(() => {
            return document.createElementNS("http://www.w3.org/2000/svg", "svg")
                .outerHTML;
        });

        expect(mappedNode).toEqual(svgNode);
    });
});

test.describe.only("mapWebComponentDefinitionToJSONSchema", () => {
    test("should not throw", () => {
        expect(() => mapWebComponentDefinitionToJSONSchema({ version: 1 })).not.toThrow();
    });
    test("should map attributes and slots to the JSON schema", () => {
        const name: string = "foo";
        const title: string = "FooBar";
        const description: string = "foo tag";
        const attrName: string = "attr";
        const attrTitle: string = "attr title";
        const attrDescription: string = "An attribute";
        const slotName: string = "";
        const slotTitle: string = "Default slot";
        const slotDescription: string = "The default slot";

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description: "foo tag",
                        attributes: [
                            {
                                name: attrName,
                                title: attrTitle,
                                description: attrDescription,
                                type: DataType.string,
                                required: false,
                                default: "",
                            },
                        ],
                        slots: [
                            {
                                name: slotName,
                                title: slotTitle,
                                description: slotDescription,
                            },
                        ],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    [attrName]: {
                        [ReservedElementMappingKeyword.mapsToAttribute]: attrName,
                        title: attrTitle,
                        description: attrDescription,
                        type: DataType.string,
                    },
                    [`Slot${slotName}`]: {
                        [ReservedElementMappingKeyword.mapsToSlot]: slotName,
                        title: slotTitle,
                        description: slotDescription,
                        ...linkedDataSchema,
                    },
                },
            },
        ]);
    });
    test("should map named slots to the JSON schema", () => {
        const name: string = "foo";
        const title: string = "foo title";
        const description: string = "foo tag";
        const slotName: string = "test";
        const slotTitle: string = "Default slot";
        const slotDescription: string = "Default slot description";

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description: "foo tag",
                        attributes: [],
                        slots: [
                            {
                                name: slotName,
                                title: slotTitle,
                                description: slotDescription,
                            },
                        ],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    SlotTest: {
                        [ReservedElementMappingKeyword.mapsToSlot]: slotName,
                        title: slotTitle,
                        description: slotDescription,
                        ...linkedDataSchema,
                    },
                },
            },
        ]);
    });
    test("should map named slots with only one character to the JSON schema", () => {
        const name: string = "foo";
        const title: string = "Foo";
        const description: string = "foo tag";
        const slotName: string = "t";
        const slotTitle: string = "Default slot";
        const slotDescription: string = "Default slot description";

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description,
                        attributes: [],
                        slots: [
                            {
                                name: slotName,
                                title: slotTitle,
                                description: slotDescription,
                            },
                        ],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    SlotT: {
                        [ReservedElementMappingKeyword.mapsToSlot]: slotName,
                        title: slotTitle,
                        description: slotDescription,
                        ...linkedDataSchema,
                    },
                },
            },
        ]);
    });
    test("should map named slots with a dashed name to the JSON schema", () => {
        const name: string = "foo";
        const title: string = "FooBar";
        const description: string = "foo tag";
        const slotName: string = "test-name";
        const slotTitle: string = "Default slot";
        const slotDescription: string = "Default slot description";

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description,
                        attributes: [],
                        slots: [
                            {
                                name: slotName,
                                title: slotTitle,
                                description: slotDescription,
                            },
                        ],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    SlotTestName: {
                        [ReservedElementMappingKeyword.mapsToSlot]: slotName,
                        title: slotTitle,
                        description: slotDescription,
                        ...linkedDataSchema,
                    },
                },
            },
        ]);
    });
    test("should map an optional enum in attributes to the enum in a JSON schema", () => {
        const name: string = "foo";
        const title: string = "FooBar";
        const description: string = "foo tag";
        const attrName: string = "attr";
        const attrTitle: string = "Attr title";
        const attrDescription: string = "An attribute";
        const attrEnum: string[] = ["foo", "bar"];

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description,
                        attributes: [
                            {
                                name: attrName,
                                title: attrTitle,
                                description: attrDescription,
                                type: DataType.string,
                                default: "foobar",
                                values: [
                                    {
                                        name: attrEnum[0],
                                    },
                                    {
                                        name: attrEnum[1],
                                    },
                                ],
                                required: false,
                            },
                        ],
                        slots: [],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    [attrName]: {
                        [ReservedElementMappingKeyword.mapsToAttribute]: attrName,
                        title: attrTitle,
                        description: attrDescription,
                        enum: attrEnum,
                        type: DataType.string,
                        default: "foobar",
                    },
                },
            },
        ]);
    });
    test("should map an optional number enum in attributes to the enum in a JSON schema", () => {
        const name: string = "foo";
        const title: string = "Foo title";
        const description: string = "foo tag";
        const attrName: string = "attr";
        const attrTitle: string = "Attr title";
        const attrDescription: string = "An attribute";
        const attrEnum: number[] = [1, 2];

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        title,
                        description,
                        attributes: [
                            {
                                name: attrName,
                                title: attrTitle,
                                description: attrDescription,
                                type: DataType.number,
                                default: "foobar",
                                values: [
                                    {
                                        name: attrEnum[0].toString(),
                                    },
                                    {
                                        name: attrEnum[1].toString(),
                                    },
                                ],
                                required: false,
                            },
                        ],
                        slots: [],
                    },
                ],
            })
        ).toMatchObject([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title,
                description,
                type: "object",
                version: 1,
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    [attrName]: {
                        [ReservedElementMappingKeyword.mapsToAttribute]: attrName,
                        title: attrTitle,
                        description: attrDescription,
                        enum: attrEnum,
                        type: DataType.number,
                        default: "foobar",
                    },
                },
            },
        ]);
    });
});
