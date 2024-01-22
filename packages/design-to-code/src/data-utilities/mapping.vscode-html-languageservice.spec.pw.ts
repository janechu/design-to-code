import { expect, test } from "../__test__/base-fixtures.js";
import { SchemaDictionary } from "../message-system/index.js";
import { linkedDataSchema } from "../schemas/index.js";
import { DataType, ReservedElementMappingKeyword } from "./types.js";

const textSchema = {
    id: "text",
    $id: "text",
    type: "string",
};

const divSchema = {
    id: "div",
    $id: "div",
    type: "object",
    mapsToTagName: "div",
};

const spanSchema = {
    id: "span",
    $id: "span",
    type: "object",
    mapsToTagName: "span",
    properties: {},
};

const inputSchema = {
    id: "input",
    $id: "input",
    type: "object",
    mapsToTagName: "input",
    properties: {
        required: {
            type: DataType.boolean,
        },
        disabled: {
            type: DataType.boolean,
        },
        value: {
            type: DataType.number,
        },
        name: {
            type: DataType.string,
        },
        SlotBar: {
            [ReservedElementMappingKeyword.mapsToSlot]: "bar",
            ...linkedDataSchema,
        },
    },
};

const customSchema = {
    id: "foo-bar",
    $id: "foo-bar",
    type: "object",
    mapsToTagName: "foo-bar",
    properties: {
        SlotFoo: {
            [ReservedElementMappingKeyword.mapsToSlot]: "foo",
            ...linkedDataSchema,
        },
    },
};

test.describe("mapVSCodeParsedHTMLToDataDictionary", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should not throw an error if the HTML array is empty", async ({ page }) => {
        const mappedValue = await page.evaluate(() => {
            (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                value: [],
                schemaDictionary: {},
            });

            return true;
        });
        await expect(mappedValue).toEqual(true);
    });
    test("should return a DataDictionary containing a text node if a text node is passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([textSchemaAsString]: [string]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["foobar"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                    },
                });
                const root: string = value[1];

                return value[0][root];
            },
            [JSON.stringify(textSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: textSchema.$id,
            data: "foobar",
        });
    });
    test("should return a DataDictionary containing an HTML element if an HTML element has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "</div>"],
                    schemaDictionary: {
                        [divSchema.$id]: divSchema,
                    },
                });
                const root: string = value[1];

                return value[0][root];
            },
            [JSON.stringify(divSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: divSchema.$id,
            data: {},
        });
    });
    test("should return a DataDictionary containing an HTML element and ignore newlines", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>\n", "</div>"],
                    schemaDictionary: {
                        [divSchema.$id]: divSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(divSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: divSchema.$id,
            data: {},
        });
    });
    test("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ['<input id="bar" />'],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                id: "bar",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed when the attribute is presented as a number", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ['<input name="1" />'],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                name: "1",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element without a slot attribute as part of the data if an HTML element with a slot attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ['<input slot="bar" />'],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {},
        });
    });
    test("should return a DataDictionary containing an HTML element with a number attribute if an HTML element with a number attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ['<input value="5" />'],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                value: 5,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a boolean attribute if an HTML element with a boolean attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<input required />"],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                required: true,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified string attribute if an HTML element with a string attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ['<input data-id="foo" />'],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                "data-id": "foo",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified null attribute if an HTML element with a null attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<input data-id />"],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                "data-id": true,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified half written string attribute if an HTML element with an incomplete attribute has been passed", async ({
        page,
    }) => {
        const mappedValue = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<input data-id= bar />"],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                return value[0][root];
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(mappedValue).toMatchObject({});
    });
    test("should return a DataDictionary containing an HTML element nested inside another HTML element", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([inputSchemaAsString, divSchemaAsString]: [string, string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "<input />", "</div>"],
                    schemaDictionary: {
                        [inputSchema.$id]: inputSchema,
                        [divSchema.$id]: divSchema,
                    },
                });
                const root: string = value[1];
                const childKey: string = (value[0][root].data as any).Slot[0].id;
                return [JSON.stringify(value[0][childKey]), root];
            },
            [JSON.stringify(inputSchema), JSON.stringify(divSchema)]
        );
        const mappedValue = JSON.parse(mappedValueAsString[0]);

        await expect(mappedValue.schemaId).toEqual(inputSchema.$id);
        await expect(mappedValue.data).toMatchObject({});
        await expect(mappedValue.parent.id).toEqual(mappedValueAsString[1]);
        await expect(mappedValue.parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([textSchemaAsString, divSchemaAsString]: [string, string]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "foobar", "</div>"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                    },
                });
                const root: string = value[1];
                const childKey: string = (value[0][root].data as any).Slot[0].id;
                return [JSON.stringify(value[0][childKey]), root];
            },
            [JSON.stringify(textSchema), JSON.stringify(divSchema)]
        );
        const mappedValue = JSON.parse(mappedValueAsString[0]);

        await expect(mappedValue.schemaId).toEqual(textSchema.$id);
        await expect(mappedValue.data).toEqual("foobar");
        await expect(mappedValue.parent.id).toEqual(mappedValueAsString[1]);
        await expect(mappedValue.parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node preceeding an HTML element", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([textSchemaAsString, divSchemaAsString, inputSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "foobar", "<input />", "</div>"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                const stringChildKey: string = (value[0][root].data as any).Slot[0].id;
                const inputChildKey: string = (value[0][root].data as any).Slot[1].id;
                return [
                    JSON.stringify(value[0][stringChildKey]),
                    JSON.stringify(value[0][inputChildKey]),
                    root,
                ];
            },
            [
                JSON.stringify(textSchema),
                JSON.stringify(divSchema),
                JSON.stringify(inputSchema),
            ]
        );
        const stringMappedValue = JSON.parse(mappedValueAsString[0]);
        const inputMappedValue = JSON.parse(mappedValueAsString[1]);

        await expect(stringMappedValue.schemaId).toEqual(textSchema.$id);
        await expect(stringMappedValue.data).toEqual("foobar");
        await expect(stringMappedValue.parent.id).toEqual(mappedValueAsString[2]);
        await expect(stringMappedValue.parent.dataLocation).toEqual("Slot");
        await expect(inputMappedValue.schemaId).toEqual(inputSchema.$id);
        await expect(inputMappedValue.data).toMatchObject({});
        await expect(inputMappedValue.parent.id).toEqual(mappedValueAsString[2]);
        await expect(inputMappedValue.parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node following an HTML element", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([textSchemaAsString, divSchemaAsString, inputSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "<input />", "foobar", "</div>"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                const inputChildKey: string = (value[0][root].data as any).Slot[0].id;
                const stringChildKey: string = (value[0][root].data as any).Slot[1].id;
                return [
                    JSON.stringify(value[0][stringChildKey]),
                    JSON.stringify(value[0][inputChildKey]),
                    root,
                ];
            },
            [
                JSON.stringify(textSchema),
                JSON.stringify(divSchema),
                JSON.stringify(inputSchema),
            ]
        );
        const stringMappedValue = JSON.parse(mappedValueAsString[0]);
        const inputMappedValue = JSON.parse(mappedValueAsString[1]);

        await expect(inputMappedValue.schemaId).toEqual(inputSchema.$id);
        await expect(inputMappedValue.data).toMatchObject({});
        await expect(inputMappedValue.parent.id).toEqual(mappedValueAsString[2]);
        await expect(inputMappedValue.parent.dataLocation).toEqual("Slot");
        await expect(stringMappedValue.schemaId).toEqual(textSchema.$id);
        await expect(stringMappedValue.data).toEqual("foobar");
        await expect(stringMappedValue.parent.id).toEqual(mappedValueAsString[2]);
        await expect(stringMappedValue.parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node bookended by HTML elements", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([textSchemaAsString, divSchemaAsString, inputSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const inputSchema = JSON.parse(inputSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "<input />", "foobar", "<input />", "</div>"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                        [inputSchema.$id]: inputSchema,
                    },
                });
                const root: string = value[1];
                const inputChildKey1: string = (value[0][root].data as any).Slot[0].id;
                const stringChildKey: string = (value[0][root].data as any).Slot[1].id;
                const inputChildKey2: string = (value[0][root].data as any).Slot[2].id;
                return [
                    JSON.stringify(value[0][stringChildKey]),
                    JSON.stringify(value[0][inputChildKey1]),
                    JSON.stringify(value[0][inputChildKey2]),
                    root,
                ];
            },
            [
                JSON.stringify(textSchema),
                JSON.stringify(divSchema),
                JSON.stringify(inputSchema),
            ]
        );
        const stringMappedValue = JSON.parse(mappedValueAsString[0]);
        const inputMappedValue1 = JSON.parse(mappedValueAsString[1]);
        const inputMappedValue2 = JSON.parse(mappedValueAsString[2]);

        await expect(inputMappedValue1.schemaId).toEqual(inputSchema.$id);
        await expect(inputMappedValue1.data).toMatchObject({});
        await expect(inputMappedValue1.parent.id).toEqual(mappedValueAsString[3]);
        await expect(inputMappedValue1.parent.dataLocation).toEqual("Slot");
        await expect(stringMappedValue.schemaId).toEqual(textSchema.$id);
        await expect(stringMappedValue.data).toEqual("foobar");
        await expect(stringMappedValue.parent.id).toEqual(mappedValueAsString[3]);
        await expect(stringMappedValue.parent.dataLocation).toEqual("Slot");
        await expect(inputMappedValue2.schemaId).toEqual(inputSchema.$id);
        await expect(inputMappedValue2.data).toMatchObject({});
        await expect(inputMappedValue2.parent.id).toEqual(mappedValueAsString[3]);
        await expect(inputMappedValue2.parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing nested HTML elements and text nodes", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([
                textSchemaAsString,
                divSchemaAsString,
                inputSchemaAsString,
                spanSchemaAsString,
            ]: [string, string, string, string]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const inputSchema = JSON.parse(inputSchemaAsString);
                const spanSchema = JSON.parse(spanSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: ["<div>", "<span>", "foobar", "</span>", "</div>"],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                        [inputSchema.$id]: inputSchema,
                        [spanSchema.$id]: spanSchema,
                    },
                });

                const root: string = value[1];
                const spanChildKey: string = (value[0][root].data as any).Slot[0].id;
                const textChildKey: string = (value[0][spanChildKey].data as any).Slot[0]
                    .id;
                return [
                    JSON.stringify(value[0][spanChildKey]),
                    JSON.stringify(value[0][textChildKey]),
                    JSON.stringify(value[0][root]),
                    root,
                    spanChildKey,
                    textChildKey,
                ];
            },
            [
                JSON.stringify(textSchema),
                JSON.stringify(divSchema),
                JSON.stringify(inputSchema),
                JSON.stringify(spanSchema),
            ]
        );
        const spanMappedValue = JSON.parse(mappedValueAsString[0]);
        const textMappedValue = JSON.parse(mappedValueAsString[1]);
        const rootMappedValue = JSON.parse(mappedValueAsString[2]);

        await expect(rootMappedValue.data).toMatchObject({
            Slot: [
                {
                    id: mappedValueAsString[4],
                },
            ],
        });
        await expect(spanMappedValue.data).toMatchObject({
            Slot: [
                {
                    id: mappedValueAsString[5],
                },
            ],
        });
        await expect(textMappedValue.data).toEqual("foobar");
    });
    test("should return a DataDictionary containing nested HTML elements with slot names", async ({
        page,
    }) => {
        const mappedValueAsString = await page.evaluate(
            ([
                textSchemaAsString,
                divSchemaAsString,
                inputSchemaAsString,
                spanSchemaAsString,
                customSchemaAsString,
            ]: [string, string, string, string, string]) => {
                const textSchema = JSON.parse(textSchemaAsString);
                const divSchema = JSON.parse(divSchemaAsString);
                const inputSchema = JSON.parse(inputSchemaAsString);
                const spanSchema = JSON.parse(spanSchemaAsString);
                const customSchema = JSON.parse(customSchemaAsString);
                const value = (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                    value: [
                        "<foo-bar>",
                        '<span slot="foo">',
                        "foobar",
                        "</span>",
                        "</foo-bar>",
                    ],
                    schemaDictionary: {
                        [textSchema.$id]: textSchema,
                        [divSchema.$id]: divSchema,
                        [inputSchema.$id]: inputSchema,
                        [spanSchema.$id]: spanSchema,
                        [customSchema.$id]: customSchema,
                    },
                });

                const root: string = value[1];
                const spanChildKey: string = (value[0][root].data as any).SlotFoo[0].id;
                return [JSON.stringify(value[0][root]), spanChildKey];
            },
            [
                JSON.stringify(textSchema),
                JSON.stringify(divSchema),
                JSON.stringify(inputSchema),
                JSON.stringify(spanSchema),
                JSON.stringify(customSchema),
            ]
        );
        const rootMappedValue = JSON.parse(mappedValueAsString[0]);

        expect(rootMappedValue.data).toMatchObject({
            SlotFoo: [
                {
                    id: mappedValueAsString[1],
                },
            ],
        });
    });
});

test.describe("mapVSCodeHTMLAndDataDictionaryToDataDictionary", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should map a parsed HTML value to a data dictionary", async ({ page }) => {
        const htmlAsString = await page.evaluate(() => {
            const html = (
                window as any
            ).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                "",
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
                            },
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        mapsToTagName: "div",
                    },
                }
            );

            return JSON.stringify(html);
        });
        const html = JSON.parse(htmlAsString);
        const keys = Object.keys(html[0]);

        await expect(keys).toHaveLength(1);
        await expect(html[0][html[1]]).toMatchObject({
            data: "",
            schemaId: "text",
        });
    });
    test.describe("should map an existing data dictionary item with values to a parsed HTML value", async () => {
        test("originating from the message system", async ({ page }) => {
            const htmlAsString = await page.evaluate(() => {
                return JSON.stringify(
                    (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                        '<ul id="baz"></ul>',
                        "text",
                        [
                            {
                                root: {
                                    schemaId: "div",
                                    data: {
                                        foo: "bar",
                                    },
                                },
                            },
                            "root",
                        ],
                        {
                            div: {
                                $id: "div",
                                mapsToTagName: "div",
                            },
                            ul: {
                                $id: "ul",
                                mapsToTagName: "ul",
                            },
                        }
                    )
                );
            });

            expect(JSON.parse(htmlAsString)).toMatchObject([
                {
                    root: {
                        schemaId: "ul",
                        data: {
                            id: "baz",
                        },
                    },
                },
                "root",
            ]);
        });
    });
    test("should map an existing data dictionary with children to a parsed HTML value with children", async ({
        page,
    }) => {
        const htmlAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span></span></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "span",
                                parent: {
                                    dataLocation: "Slot",
                                    id: "root",
                                },
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        await expect(JSON.parse(htmlAsString)).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        dataLocation: "Slot",
                        id: "root",
                    },
                    data: {},
                },
            },
            "root",
        ]);
    });
    test("should map an existing data dictionary item with children to an existing parsed HTML value without children", async ({
        page,
    }) => {
        const htmlAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "span",
                                parent: {
                                    dataLocation: "Slot",
                                    id: "root",
                                },
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        await expect(JSON.parse(htmlAsString)).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                    },
                },
            },
            "root",
        ]);
    });
    test("should map an existing data dictionary item without children to an existing parsed HTML value with a child node", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span></span></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        expect(keys).toHaveLength(2);
        expect((mappedData[0][mappedData[1]].data as any).Slot).toMatchObject([
            {
                id: keys[1],
            },
        ]);
        expect(mappedData[0][keys[1]]).toMatchObject({
            schemaId: "span",
            parent: {
                dataLocation: "Slot",
                id: "root",
            },
            data: {},
        });
    });
    test("should map an existing data dictionary item without children to an existing parsed HTML value with multiple child nodes", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span></span><input /></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        input: {
                            $id: "input",
                            id: "input",
                            mapsToTagName: "input",
                            properties: {},
                        },
                    }
                )
            );
        });
        const mappedData = JSON.parse(mappedDataAsString);

        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(3);
        await expect((mappedData[0][keys[0]].data as any).Slot).toMatchObject([
            {
                id: keys[1],
            },
            {
                id: keys[2],
            },
        ]);
    });
    test("should map an existing data dictionary item without children to an existing parsed HTML value with a text node", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz">FooBar</div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        text: {
                            $id: "text",
                            id: "text",
                            type: "string",
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(2);
        await expect((mappedData[0][keys[0]].data as any).Slot).toMatchObject([
            {
                id: keys[1],
            },
        ]);
        await expect(mappedData[0][keys[1]]).toMatchObject({
            schemaId: "text",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: "FooBar",
        });
    });
    test("should map an existing data dictionary with multiple matching children to an existing parsed HTML value with multiple children", async ({
        page,
    }) => {
        const mappedDataAsString: string[] = await page.evaluate((): string[] => {
            const schemaDictionary: SchemaDictionary = {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                text: {
                    $id: "text",
                    id: "text",
                    type: "string",
                },
            };
            const mappedData1 = (
                window as any
            ).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                '<div id="baz">FooBar<span></span></div>',
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
                                Slot: [
                                    {
                                        id: "bar",
                                    },
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: {},
                        },
                        bar: {
                            schemaId: "text",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: "FooBar",
                        },
                    },
                    "root",
                ],
                schemaDictionary
            );
            const keys1 = Object.keys(mappedData1[0]);
            const mappedData2 = (
                window as any
            ).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                '<div id="baz"><span></span>FooBar</div>',
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
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
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: {},
                        },
                        bar: {
                            schemaId: "text",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: "FooBar",
                        },
                    },
                    "root",
                ],
                schemaDictionary
            );

            return [
                JSON.stringify(mappedData1),
                JSON.stringify(mappedData2),
                JSON.stringify(keys1),
            ];
        });

        const mappedData1 = JSON.parse(mappedDataAsString[0]);
        const mappedData2 = JSON.parse(mappedDataAsString[1]);
        const keys2 = Object.keys(mappedData2[0]);

        await expect(JSON.parse(mappedDataAsString[2])).toHaveLength(3);
        await expect(mappedData1).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "bar",
                            },
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
                bar: {
                    schemaId: "text",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: "FooBar",
                },
            },
            "root",
        ]);
        await expect(keys2).toHaveLength(3);
        await expect(mappedData2).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
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
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
                bar: {
                    schemaId: "text",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: "FooBar",
                },
            },
            "root",
        ]);
    });
    test("should map an existing data dictionary with multiple children to an existing parsed HTML value with multiple matching children and new children", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span></span>FooBar<div></div></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
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
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {},
                            },
                            bar: {
                                schemaId: "text",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: "FooBar",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        text: {
                            $id: "text",
                            id: "text",
                            type: "string",
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(4);
        await expect((mappedData[0].root.data as any).Slot).toHaveLength(3);
        await expect((mappedData[0].root.data as any).Slot[2]).toMatchObject({
            id: keys[3],
        });
        await expect(mappedData[0][keys[3]]).toMatchObject({
            schemaId: "div",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: {},
        });
    });
    test("should map an existing data dictionary with multiple matching children to an existing parsed HTML value with multiple children and missing children", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span></span></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
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
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {},
                            },
                            bar: {
                                schemaId: "text",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: "FooBar",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                        text: {
                            $id: "text",
                            id: "text",
                            type: "string",
                        },
                    }
                )
            );
        });

        await expect(JSON.parse(mappedDataAsString)).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
            },
            "root",
        ]);
    });
    test("should map an existing data dictionary with named slots to an existing parsed HTML value with named slots", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><span id="foo1" title="foo2" slot="test"></span></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    SlotTest: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotTest",
                                },
                                data: {
                                    id: "foo1",
                                    title: "foo2",
                                    slot: "test",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                                SlotTest: {
                                    mapsToSlot: "test",
                                },
                            },
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        await expect(JSON.parse(mappedDataAsString)).toMatchObject([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        SlotTest: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "SlotTest",
                    },
                    data: {
                        id: "foo1",
                        title: "foo2",
                        slot: "test",
                    },
                },
            },
            "root",
        ]);
    });
    test("should map an existing data dictionary to an existing parsed HTML value with a partial tag (1)", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><</div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(2);
        await expect(mappedData[0][keys[1]]).toMatchObject({
            schemaId: "text",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: "<",
        });
    });
    test("should map an existing data dictionary to an existing parsed HTML value with a partial tag (2)", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><div><</div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "div",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                                SlotTest: {
                                    mapsToSlot: "test",
                                },
                            },
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(3);
        await expect(mappedData[0][keys[1]].data).toMatchObject({
            Slot: [
                {
                    id: keys[2],
                },
            ],
        });
        await expect(mappedData[0][keys[2]]).toMatchObject({
            schemaId: "text",
            parent: {
                id: "foo",
                dataLocation: "Slot",
            },
            data: "<",
        });
    });
    test("should map an existing data dictionary with a single attribute to an existing parsed HTMLvalue with multiple attributes", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><div id="foo" title="bar"></div></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "div",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    id: "foo",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                id: {
                                    type: "string",
                                },
                                title: {
                                    type: "string",
                                },
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(2);
        await expect(mappedData[0][keys[1]].data).toMatchObject({
            id: "foo",
            title: "bar",
        });
    });
    test("should map an existing data dictionary with multiple attributes to an existing parsed HTMLvalue with a single attribute", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="baz"><div id="foo"></div></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "div",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    id: "foo",
                                    title: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                id: {
                                    type: "string",
                                },
                                title: {
                                    type: "string",
                                },
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        const mappedData = JSON.parse(mappedDataAsString);
        const keys = Object.keys(mappedData[0]);

        await expect(keys).toHaveLength(2);
        await expect(mappedData[0][keys[1]].data).toMatchObject({
            id: "foo",
        });
    });
    test("should map an un-parsable attribute without throwing an error", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div id="></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                            properties: {
                                Slot: {
                                    mapsToSlot: "",
                                },
                            },
                        },
                    }
                )
            );
        });

        await expect(JSON.parse(mappedDataAsString)[0].root).toMatchObject({
            schemaId: "div",
            data: {
                id: "",
            },
        });
    });
    test("should map boolean attributes", async ({ page }) => {
        const mappedDataAsString = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                return JSON.stringify(
                    (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                        "<input required />",
                        "text",
                        [
                            {
                                root: {
                                    schemaId: "input",
                                    data: {},
                                },
                            },
                            "root",
                        ],
                        {
                            [inputSchema.$id]: inputSchema,
                        }
                    )
                );
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(JSON.parse(mappedDataAsString)[0].root).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                required: true,
            },
        });
    });
    test("should map number attributes", async ({ page }) => {
        const mappedDataAsString = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                return JSON.stringify(
                    (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                        '<input value="5" />',
                        "text",
                        [
                            {
                                root: {
                                    schemaId: "input",
                                    data: {},
                                },
                            },
                            "root",
                        ],
                        {
                            [inputSchema.$id]: inputSchema,
                        }
                    )
                );
            },
            [JSON.stringify(inputSchema)]
        );

        await expect(JSON.parse(mappedDataAsString)[0].root).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                value: 5,
            },
        });
    });
    test("should map a string attribute", async ({ page }) => {
        const mappedDataAsString = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                return JSON.stringify(
                    (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                        value: ['<input name="foo" />'],
                        schemaDictionary: {
                            [inputSchema.$id]: inputSchema,
                        },
                    })
                );
            },
            [JSON.stringify(inputSchema)]
        );
        const mappedData = JSON.parse(mappedDataAsString);
        const root: string = mappedData[1];

        await expect(mappedData[0][root]).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                name: "foo",
            },
        });
    });
    test("should map a string attribute even when presented as a number", async ({
        page,
    }) => {
        const mappedDataAsString = await page.evaluate(
            ([inputSchemaAsString]: [string]) => {
                const inputSchema = JSON.parse(inputSchemaAsString);
                return JSON.stringify(
                    (window as any).dtc.mapVSCodeParsedHTMLToDataDictionary({
                        value: ['<input name="1" />'],
                        schemaDictionary: {
                            [inputSchema.$id]: inputSchema,
                        },
                    })
                );
            },
            [JSON.stringify(inputSchema)]
        );

        const mappedData = JSON.parse(mappedDataAsString);
        const root: string = mappedData[1];
        expect(mappedData[0][root]).toMatchObject({
            schemaId: inputSchema.$id,
            data: {
                name: "1",
            },
        });
    });
    test("should map a new node with children and attributes", async ({ page }) => {
        const mappedDataAsString = await page.evaluate(() => {
            return JSON.stringify(
                (window as any).dtc.mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<div><div><img src="https://via.placeholder.com/320x180" /><span>LOREM</span></div><div><img src="https://via.placeholder.com/320x180" /><span>LOREM</span></div></div>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "fast1",
                                        },
                                    ],
                                },
                            },
                            fast1: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "fast2",
                                        },
                                        {
                                            id: "fast3",
                                        },
                                    ],
                                },
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                            },
                            fast2: {
                                schemaId: "img",
                                data: {
                                    src: "https://via.placeholder.com/320x180",
                                },
                                parent: {
                                    id: "fast1",
                                    dataLocation: "Slot",
                                },
                            },
                            fast3: {
                                schemaId: "span",
                                data: {
                                    Slot: [
                                        {
                                            id: "fast4",
                                        },
                                    ],
                                },
                                parent: {
                                    id: "fast1",
                                    dataLocation: "Slot",
                                },
                            },
                            fast4: {
                                schemaId: "text",
                                data: "LOREM",
                                parent: {
                                    id: "fast3",
                                    dataLocation: "Slot",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            id: "div",
                            mapsToTagName: "div",
                        },
                        span: {
                            $id: "span",
                            id: "span",
                            mapsToTagName: "span",
                        },
                        img: {
                            $id: "img",
                            id: "img",
                            mapsToTagName: "img",
                            type: "object",
                            properties: {
                                src: {
                                    type: "string",
                                },
                            },
                        },
                        text: {
                            $id: "text",
                            id: "text",
                            type: "string",
                        },
                    }
                )
            );
        });
        const mappedData = JSON.parse(mappedDataAsString);

        await expect((mappedData[0].root.data as any)?.Slot).toHaveLength(2);
        await expect(Object.keys(mappedData[0])).toHaveLength(9);
        const newNodeId = (mappedData[0].root.data as any)?.Slot[1].id;
        await expect((mappedData[0][newNodeId].data as any)?.Slot).toHaveLength(2);
        const newNodeWithAttribId = (mappedData[0][newNodeId].data as any)?.Slot[0].id;
        await expect(mappedData[0][newNodeWithAttribId].data).toMatchObject({
            src: "https://via.placeholder.com/320x180",
        });
    });
});
