import { expect, test } from "@playwright/test";
import { linkedDataSchema } from "../schemas/index.js";
import { DataType, ReservedElementMappingKeyword } from "./types.js";

const divSchema = {
    type: DataType.object,
    [ReservedElementMappingKeyword.mapsToTagName]: "div",
    properties: {
        Slot: linkedDataSchema,
    },
};
const textSchema = {
    type: DataType.string,
};

test.describe("mapDataDictionaryToMonacoEditorHTML", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should not map a data dictionary if no schema dictionaries conform to entries", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(() => {
            const text = "Hello world";
            return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "text",
                            data: text,
                        },
                    },
                    "root",
                ],
                {}
            );
        });

        await expect(mappedData).toEqual("");
    });
    test("should map a data dictionary with a single string entry", async ({ page }) => {
        const text = "Hello world";
        const mappedData = await page.evaluate(
            ([text]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "text",
                                data: text,
                            },
                        },
                        "root",
                    ],
                    {
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [text]
        );

        expect(mappedData).toEqual(text);
    });
    test("should not map a data dictionary with no mapsToTagName", async ({ page }) => {
        const text = "";
        const mappedData = await page.evaluate(() => {
            return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
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
                    input: {
                        id: "input",
                        type: "object",
                    },
                }
            );
        });

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with a single self closing entry", async ({
        page,
    }) => {
        const text = "<input />";
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
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
                        input: {
                            id: "input",
                            type: "object",
                            [mapsToTagName]: "input",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with a single element entry", async ({ page }) => {
        const text = "<div></div>";
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with nested entries", async ({ page }) => {
        const text = "<div>Hello world</div>";
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text",
                                        },
                                    ],
                                },
                            },
                            text: {
                                schemaId: "text",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with multiple nested entries", async ({
        page,
    }) => {
        const text = "<div><span>Hello world</span></div>";
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "span",
                                        },
                                    ],
                                },
                            },
                            span: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text",
                                        },
                                    ],
                                },
                            },
                            text: {
                                schemaId: "text",
                                parent: {
                                    id: "span",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                        },
                        span: {
                            id: "span",
                            type: "object",
                            [mapsToTagName]: "span",
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with named and unnamed slotted nested entries", async ({
        page,
    }) => {
        const text = '<div><span slot="foo">Hello world</span></div>';
        const mappedData = await page.evaluate(
            ([mapsToTagName, mapsToSlot, linkedDataSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const linkedDataSchema = JSON.parse(linkedDataSchemaAsString);
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    SlotFoo: [
                                        {
                                            id: "span",
                                        },
                                    ],
                                },
                            },
                            span: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotFoo",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text",
                                        },
                                    ],
                                },
                            },
                            text: {
                                schemaId: "text",
                                parent: {
                                    id: "span",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                            properties: {
                                SlotFoo: {
                                    [mapsToSlot]: "foo",
                                    ...linkedDataSchema,
                                },
                            },
                        },
                        span: {
                            id: "span",
                            type: "object",
                            [mapsToTagName]: "span",
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
                JSON.stringify(linkedDataSchema),
            ]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with multiple named slotted entries", async ({
        page,
    }) => {
        const text =
            '<div><span slot="foo">Hello world</span><span slot="foo">Hello pluto</span></div>';
        const mappedData = await page.evaluate(
            ([mapsToTagName, mapsToSlot, linkedDataSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const linkedDataSchema = JSON.parse(linkedDataSchemaAsString);
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    SlotFoo: [
                                        {
                                            id: "span1",
                                        },
                                        {
                                            id: "span2",
                                        },
                                    ],
                                },
                            },
                            span1: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotFoo",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text1",
                                        },
                                    ],
                                },
                            },
                            text1: {
                                schemaId: "text",
                                parent: {
                                    id: "span1",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                            span2: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotFoo",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text2",
                                        },
                                    ],
                                },
                            },
                            text2: {
                                schemaId: "text",
                                parent: {
                                    id: "span2",
                                    dataLocation: "Slot",
                                },
                                data: "Hello pluto",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                            properties: {
                                SlotFoo: {
                                    [mapsToSlot]: "foo",
                                    ...linkedDataSchema,
                                },
                            },
                        },
                        span: {
                            id: "span",
                            type: "object",
                            [mapsToTagName]: "span",
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
                JSON.stringify(linkedDataSchema),
            ]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with multiple different named slotted entries", async ({
        page,
    }) => {
        const text =
            '<div><span slot="foo">Hello world</span><span id="foo1" title="foo2" slot="bar">Hello pluto</span></div>';
        const mappedData = await page.evaluate(
            ([mapsToTagName, mapsToSlot, linkedDataSchemaAsString]: [
                string,
                string,
                string
            ]) => {
                const linkedDataSchema = JSON.parse(linkedDataSchemaAsString);
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    SlotFoo: [
                                        {
                                            id: "span1",
                                        },
                                    ],
                                    SlotBar: [
                                        {
                                            id: "span2",
                                        },
                                    ],
                                },
                            },
                            span1: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotFoo",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text1",
                                        },
                                    ],
                                },
                            },
                            text1: {
                                schemaId: "text",
                                parent: {
                                    id: "span1",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                            span2: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "SlotBar",
                                },
                                data: {
                                    id: "foo1",
                                    title: "foo2",
                                    Slot: [
                                        {
                                            id: "text2",
                                        },
                                    ],
                                },
                            },
                            text2: {
                                schemaId: "text",
                                parent: {
                                    id: "span2",
                                    dataLocation: "Slot",
                                },
                                data: "Hello pluto",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                            properties: {
                                SlotFoo: {
                                    [mapsToSlot]: "foo",
                                    ...linkedDataSchema,
                                },
                                SlotBar: {
                                    [mapsToSlot]: "bar",
                                    ...linkedDataSchema,
                                },
                            },
                        },
                        span: {
                            id: "span",
                            type: "object",
                            [mapsToTagName]: "span",
                            properties: {
                                id: {
                                    type: "string",
                                },
                                title: {
                                    type: "string",
                                },
                            },
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [
                ReservedElementMappingKeyword.mapsToTagName,
                ReservedElementMappingKeyword.mapsToSlot,
                JSON.stringify(linkedDataSchema),
            ]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with attributes with a single self closing entry", async ({
        page,
    }) => {
        const text = '<input title="foo" disabled count="5" />';
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "input",
                                data: {
                                    title: "foo",
                                    required: false,
                                    disabled: true,
                                    count: 5,
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        input: {
                            id: "input",
                            type: "object",
                            [mapsToTagName]: "input",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with attributes with a single element entry", async ({
        page,
    }) => {
        const text = '<div id="foo"></div>';
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    id: "foo",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );

        expect(mappedData).toEqual(text);
    });
    test("should map a data dictionary with multiple out of order nested entries at the same level", async ({
        page,
    }) => {
        const text = "<div><span>Hello world</span><div>Hello pluto</div></div>";
        const mappedData = await page.evaluate(
            ([mapsToTagName]: [string]) => {
                return (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "span",
                                        },
                                        {
                                            id: "div",
                                        },
                                    ],
                                },
                            },
                            div: {
                                schemaId: "div",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text2",
                                        },
                                    ],
                                },
                            },
                            span: {
                                schemaId: "span",
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                data: {
                                    Slot: [
                                        {
                                            id: "text",
                                        },
                                    ],
                                },
                            },
                            text2: {
                                schemaId: "text",
                                parent: {
                                    id: "div",
                                    dataLocation: "Slot",
                                },
                                data: "Hello pluto",
                            },
                            text: {
                                schemaId: "text",
                                parent: {
                                    id: "span",
                                    dataLocation: "Slot",
                                },
                                data: "Hello world",
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            id: "div",
                            type: "object",
                            [mapsToTagName]: "div",
                        },
                        span: {
                            id: "span",
                            type: "object",
                            [mapsToTagName]: "span",
                        },
                        text: {
                            id: "text",
                            type: "string",
                        },
                    }
                );
            },
            [ReservedElementMappingKeyword.mapsToTagName]
        );
        expect(mappedData).toEqual(text);
    });
});

test.describe("findMonacoEditorHTMLPositionByDictionaryId", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should find the root dictionary ID", async ({ page }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString]: [string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "root",
                            [
                                {
                                    root: {
                                        schemaId: "div",
                                        data: {},
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                            },
                            ["<div></div>"]
                        )
                    );
                },
                [JSON.stringify(divSchema)]
            )
        );

        expect(position.column).toEqual(1);
        expect(position.lineNumber).toEqual(1);
    });
    test("should find a nested dictionary ID", async ({ page }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString]: [string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "foo",
                            [
                                {
                                    root: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "foo",
                                                },
                                            ],
                                        },
                                    },
                                    foo: {
                                        schemaId: "div",
                                        data: {},
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                            },
                            ["<div>", "    <div></div>", "</div>"]
                        )
                    );
                },
                [JSON.stringify(divSchema)]
            )
        );

        expect(position.column).toEqual(6);
        expect(position.lineNumber).toEqual(2);
    });
    test("should find a nested dictionary ID with adjacent dictionary IDs", async ({
        page,
    }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString]: [string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "bar",
                            [
                                {
                                    root: {
                                        schemaId: "div",
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
                                        schemaId: "div",
                                        data: {},
                                    },
                                    bar: {
                                        schemaId: "div",
                                        data: {},
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                            },
                            ["<div>", "    <div></div>", "    <div></div>", "</div>"]
                        )
                    );
                },
                [JSON.stringify(divSchema)]
            )
        );

        expect(position.column).toEqual(6);
        expect(position.lineNumber).toEqual(3);
    });
    test("should find a nested dictionary ID when there are text nodes", async ({
        page,
    }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString, textSchemaAsString]: [string, string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    const textSchema = JSON.parse(textSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "bar",
                            [
                                {
                                    root: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text1",
                                                },
                                                {
                                                    id: "foo",
                                                },
                                                {
                                                    id: "text2",
                                                },
                                                {
                                                    id: "bar",
                                                },
                                            ],
                                        },
                                    },
                                    text1: {
                                        schemaId: "text",
                                        data: "Hello world",
                                    },
                                    foo: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text3",
                                                },
                                            ],
                                        },
                                    },
                                    text3: {
                                        schemaId: "text",
                                        data: "Hello",
                                    },
                                    text2: {
                                        schemaId: "text",
                                        data: "Hello world",
                                    },
                                    bar: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text4",
                                                },
                                            ],
                                        },
                                    },
                                    text4: {
                                        schemaId: "text",
                                        data: "world",
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                                text: textSchema,
                            },
                            [
                                "<div>",
                                "    Hello world",
                                "    <div>Hello</div>",
                                "    Hello world",
                                "    <div>world</div>",
                                "</div>",
                            ]
                        )
                    );
                },
                [JSON.stringify(divSchema), JSON.stringify(textSchema)]
            )
        );

        expect(position.column).toEqual(6);
        expect(position.lineNumber).toEqual(5);
    });
    test("should get a nested dictionary item when it is on the same line as another item", async ({
        page,
    }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString, textSchemaAsString]: [string, string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    const textSchema = JSON.parse(textSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "foobar",
                            [
                                {
                                    root: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text1",
                                                },
                                                {
                                                    id: "foo",
                                                },
                                                {
                                                    id: "text2",
                                                },
                                                {
                                                    id: "bar",
                                                },
                                                {
                                                    id: "foobar",
                                                },
                                            ],
                                        },
                                    },
                                    text1: {
                                        schemaId: "text",
                                        data: "Hello world",
                                    },
                                    foo: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text3",
                                                },
                                            ],
                                        },
                                    },
                                    text3: {
                                        schemaId: "text",
                                        data: "Hello",
                                    },
                                    text2: {
                                        schemaId: "text",
                                        data: "Hello world",
                                    },
                                    bar: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text4",
                                                },
                                            ],
                                        },
                                    },
                                    text4: {
                                        schemaId: "text",
                                        data: "world",
                                    },
                                    foobar: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "text5",
                                                },
                                            ],
                                        },
                                    },
                                    text5: {
                                        schemaId: "text",
                                        data: "foobar",
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                                text: textSchema,
                            },
                            [
                                "<div>",
                                "    Hello world",
                                "    <div>Hello</div>",
                                "    Hello world",
                                "    <div>world</div><div>foobar</div>",
                                "</div>",
                            ]
                        )
                    );
                },
                [JSON.stringify(divSchema), JSON.stringify(textSchema)]
            )
        );

        expect(position.column).toEqual(22);
        expect(position.lineNumber).toEqual(5);
    });
    test("should get the root location if the dictionary ID could not be found", async ({
        page,
    }) => {
        const position = JSON.parse(
            await page.evaluate(
                ([divSchemaAsString]: [string]) => {
                    const divSchema = JSON.parse(divSchemaAsString);
                    return JSON.stringify(
                        (window as any).dtc.findMonacoEditorHTMLPositionByDictionaryId(
                            "undefined",
                            [
                                {
                                    root: {
                                        schemaId: "div",
                                        data: {
                                            Slot: [
                                                {
                                                    id: "foo",
                                                },
                                            ],
                                        },
                                    },
                                    foo: {
                                        schemaId: "div",
                                        data: {},
                                    },
                                },
                                "root",
                            ],
                            {
                                div: divSchema,
                            },
                            ["<div>", "    <div></div>", "</div>"]
                        )
                    );
                },
                [JSON.stringify(divSchema)]
            )
        );

        expect(position.column).toEqual(1);
        expect(position.lineNumber).toEqual(1);
    });
});

test.describe("findDictionaryIdByMonacoEditorHTMLPosition", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/utilities");
    });
    test("should find the root dictionary ID", async ({ page }) => {
        const dictionaryId = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        lineNumber: 0,
                        column: 0,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div></div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId).toEqual("root");
    });
    test("should find a nested dictionary ID", async ({ page }) => {
        const dictionaryId1 = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        lineNumber: 2,
                        column: 6,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div>", "    <div></div>", "</div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId1).toEqual("foo");

        const dictionaryId2 = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        lineNumber: 1,
                        column: 14,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                parent: {
                                    id: "root",
                                    dataLocation: "Slot",
                                },
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div>", "    <div></div>", "</div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId2).toEqual("foo");
    });
    test("should find a nested dictionary ID with adjacent dictionary IDs", async ({
        page,
    }) => {
        const dictionaryId1 = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        lineNumber: 2,
                        column: 6,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
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
                                schemaId: "div",
                                data: {},
                            },
                            bar: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div>", "    <div></div>", "    <div></div>", "</div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId1).toEqual("foo");

        const dictionaryId2 = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        lineNumber: 3,
                        column: 6,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
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
                                schemaId: "div",
                                data: {},
                            },
                            bar: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div>", "    <div></div>", "    <div></div>", "</div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId2).toEqual("bar");
    });
    test("should find a nested dictionary ID when there are text nodes", async ({
        page,
    }) => {
        const dictionaryId = await page.evaluate(
            ([divSchemaAsString, textSchemaAsString]: [string, string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                const textSchema = JSON.parse(textSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        column: 6,
                        lineNumber: 5,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text1",
                                        },
                                        {
                                            id: "foo",
                                        },
                                        {
                                            id: "text2",
                                        },
                                        {
                                            id: "bar",
                                        },
                                    ],
                                },
                            },
                            text1: {
                                schemaId: "text",
                                data: "Hello world",
                            },
                            foo: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text3",
                                        },
                                    ],
                                },
                            },
                            text3: {
                                schemaId: "text",
                                data: "Hello",
                            },
                            text2: {
                                schemaId: "text",
                                data: "Hello world",
                            },
                            bar: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text4",
                                        },
                                    ],
                                },
                            },
                            text4: {
                                schemaId: "text",
                                data: "world",
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                        text: textSchema,
                    },
                    [
                        "<div>",
                        "    Hello world",
                        "    <div>Hello</div>",
                        "    Hello world",
                        "    <div>world</div>",
                        "</div>",
                    ]
                );
            },
            [JSON.stringify(divSchema), JSON.stringify(textSchema)]
        );

        expect(dictionaryId).toEqual("bar");
    });
    test("should get a nested dictionary item when it is on the same line as another item", async ({
        page,
    }) => {
        const dictionaryId = await page.evaluate(
            ([divSchemaAsString, textSchemaAsString]: [string, string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                const textSchema = JSON.parse(textSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        column: 22,
                        lineNumber: 5,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text1",
                                        },
                                        {
                                            id: "foo",
                                        },
                                        {
                                            id: "text2",
                                        },
                                        {
                                            id: "bar",
                                        },
                                        {
                                            id: "foobar",
                                        },
                                    ],
                                },
                            },
                            text1: {
                                schemaId: "text",
                                data: "Hello world",
                            },
                            foo: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text3",
                                        },
                                    ],
                                },
                            },
                            text3: {
                                schemaId: "text",
                                data: "Hello",
                            },
                            text2: {
                                schemaId: "text",
                                data: "Hello world",
                            },
                            bar: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text4",
                                        },
                                    ],
                                },
                            },
                            text4: {
                                schemaId: "text",
                                data: "world",
                            },
                            foobar: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "text5",
                                        },
                                    ],
                                },
                            },
                            text5: {
                                schemaId: "text",
                                data: "foobar",
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                        text: textSchema,
                    },
                    [
                        "<div>",
                        "    Hello world",
                        "    <div>Hello</div>",
                        "    Hello world",
                        "    <div>world</div><div>foobar</div>",
                        "</div>",
                    ]
                );
            },
            [JSON.stringify(divSchema), JSON.stringify(textSchema)]
        );

        expect(dictionaryId).toEqual("foobar");
    });
    test("should get the root location if the dictionary ID could not be found", async ({
        page,
    }) => {
        const dictionaryId = await page.evaluate(
            ([divSchemaAsString]: [string]) => {
                const divSchema = JSON.parse(divSchemaAsString);
                return (window as any).dtc.findDictionaryIdByMonacoEditorHTMLPosition(
                    {
                        column: 0,
                        lineNumber: 0,
                    },
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    Slot: [
                                        {
                                            id: "foo",
                                        },
                                    ],
                                },
                            },
                            foo: {
                                schemaId: "div",
                                data: {},
                            },
                        },
                        "root",
                    ],
                    {
                        div: divSchema,
                    },
                    ["<div>", "    <div></div>", "</div>"]
                );
            },
            [JSON.stringify(divSchema)]
        );

        expect(dictionaryId).toEqual("root");
    });
});
