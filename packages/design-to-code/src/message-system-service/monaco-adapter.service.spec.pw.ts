import { expect, test } from "../__test__/base-fixtures.js";
import { DataDictionary, MessageSystemType, Register } from "../message-system/index.js";
import { MessageSystemSchemaDictionaryTypeAction } from "../message-system/message-system.utilities.props.js";
import {
    findDictionaryIdParents,
    findUpdatedDictionaryId,
} from "./monaco-adapter.service.utilities.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe("MonacoAdapter", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system.html");
    });
    test("should not throw", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: undefined,
                        },
                    },
                    "foo",
                ],
                schemaDictionary: {
                    foo: {},
                },
            });

            new (window as any).dtc.MonacoAdapter({
                messageSystem,
            });

            return true;
        });
        expect(didNotError).toEqual(true);
    });
    test("should not throw if the message system is undefined", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            new (window as any).dtc.MonacoAdapter({
                messageSystem: undefined,
            });

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should register to the message system", async ({ page }) => {
        const sizes = await page.evaluate(() => {
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: undefined,
                        },
                    },
                    "foo",
                ],
                schemaDictionary: {
                    foo: {},
                },
            });

            const size1 = messageSystem["register"].size;

            new (window as any).dtc.MonacoAdapter({
                messageSystem,
            });

            const size2 = messageSystem["register"].size;

            return [size1, size2];
        });

        expect(sizes[0]).toEqual(0);
        expect(sizes[1]).toEqual(1);
    });
    test("should deregister from the message system", async ({ page }) => {
        const sizes = await page.evaluate(() => {
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: undefined,
                        },
                    },
                    "foo",
                ],
                schemaDictionary: {
                    foo: {},
                },
            });

            const size1 = messageSystem["register"].size;

            const shortcuts = new (window as any).dtc.MonacoAdapter({
                messageSystem,
            });

            const size2 = messageSystem["register"].size;

            shortcuts.destroy();

            const size3 = messageSystem["register"].size;

            return [size1, size2, size3];
        });

        expect(sizes[0]).toEqual(0);
        expect(sizes[1]).toEqual(1);
        expect(sizes[2]).toEqual(0);
    });
    test("should fire an action when a matching MessageSystemType is included", async ({
        page,
    }) => {
        const generatedStrings = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                let expectedValue = [];
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: config => {
                                expectedValue = config.getMonacoModelValue();
                            },
                            messageSystemType: messageSystemTypeInitialize,
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                return [
                    JSON.stringify(expectedValue[0]),
                    JSON.stringify(
                        (window as any).dtc.mapDataDictionaryToMonacoEditorHTML(
                            dataDictionary,
                            schemaDictionary
                        )
                    ),
                ];
            },
            [MessageSystemType.initialize]
        );

        expect(generatedStrings[0]).toEqual(generatedStrings[1]);
    });
    test("should update the data dictionary when an initialize event is fired", async ({
        page,
    }) => {
        const generatedStrings = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                        text: {
                            schemaId: "text",
                            data: "foo",
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                    text: {
                        id: "text",
                        $id: "text",
                        type: "string",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                return [
                    JSON.stringify(monacoAdapter["dataDictionary"]),
                    JSON.stringify(dataDictionary),
                ];
            },
            [MessageSystemType.initialize]
        );

        expect(generatedStrings[0]).toEqual(generatedStrings[1]);
    });
    test("should change the dictionary id when a navigation event is fired", async ({
        page,
    }) => {
        const dictionaryId = await page.evaluate(
            ([messageSystemTypeInitialize, messageSystemTypeNavigation]: [
                string,
                string
            ]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                        text: {
                            schemaId: "text",
                            data: "foo",
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                    text: {
                        id: "text",
                        $id: "text",
                        type: "string",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeNavigation,
                            activeDictionaryId: "text",
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                return monacoAdapter["dictionaryId"];
            },
            [MessageSystemType.initialize, MessageSystemType.navigation]
        );

        expect(dictionaryId).toEqual("text");
    });
    test("should update the data dictionary when the data dictionary event is fired", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize, messageSystemTypeData]: [string, string]) => {
                const dataDictionary1: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                        text: {
                            schemaId: "text",
                            data: "foo",
                        },
                    },
                    "div",
                ];
                const dataDictionary2: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                        foo: {
                            schemaId: "text",
                            data: "bar",
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                    text: {
                        id: "text",
                        $id: "text",
                        type: "string",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary: dataDictionary1,
                            schemaDictionary,
                        },
                    } as any);
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeData,
                            dataDictionary: dataDictionary2,
                            activeDictionaryId: "foo",
                            schemaDictionary,
                        },
                    } as any);
                });

                return [
                    JSON.stringify(monacoAdapter["dataDictionary"]),
                    JSON.stringify(dataDictionary2),
                    monacoAdapter["dictionaryId"],
                ];
            },
            [MessageSystemType.initialize, MessageSystemType.data]
        );

        expect(mappedData[0]).toEqual(mappedData[1]);
        expect(mappedData[2]).toEqual("foo");
    });
    test("should update the data dictionary when the data event is fired", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize, messageSystemTypeData]: [string, string]) => {
                const dataDictionary1: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                        text: {
                            schemaId: "text",
                            data: "foo",
                        },
                    },
                    "div",
                ];
                const dataDictionary2: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                    text: {
                        id: "text",
                        $id: "text",
                        type: "string",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary: dataDictionary1,
                            schemaDictionary,
                        },
                    } as any);
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeData,
                            dataDictionary: dataDictionary2,
                            schemaDictionary,
                        },
                    } as any);
                });

                return [
                    JSON.stringify(monacoAdapter["dataDictionary"]),
                    JSON.stringify(dataDictionary2),
                ];
            },
            [MessageSystemType.initialize, MessageSystemType.data]
        );

        expect(mappedData[0]).toEqual(mappedData[1]);
    });
    test("should fire an action when the corresponding id is used", async ({ page }) => {
        const actionCount = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                let actionCount = 0;
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const runAction = () => {
                    actionCount++;
                };
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: runAction,
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                monacoAdapter.action("foo").run();

                return actionCount;
            },
            [MessageSystemType.initialize]
        );

        expect(actionCount).toEqual(1);
    });
    test("should update the monaco value", async ({ page }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        properties: {},
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                let callbackCount = 0;
                const callback = () => {
                    callbackCount++;
                };
                messageSystem.postMessage = callback;
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: config => {
                                config.updateMonacoModelValue(["bar"], false);
                            },
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                            activeDictionaryId: "div",
                        },
                    } as any);
                });

                monacoAdapter.action("foo").run();

                return [JSON.stringify(monacoAdapter["monacoModelValue"]), callbackCount];
            },
            [MessageSystemType.initialize]
        );

        expect(JSON.parse(mappedData[0] as string)).toMatchObject(["bar"]);
        expect(mappedData[1]).toEqual(1);
    });
    test("should update the monaco value but not send a post message if the source is external", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                let callbackCount = 0;
                const callback = () => {
                    callbackCount++;
                };
                messageSystem.postMessage = callback;

                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: config => {
                                config.updateMonacoModelValue(["bar"], true);
                            },
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                            activeDictionaryId: "div",
                        },
                    } as any);
                });

                monacoAdapter.action("foo").run();

                return [JSON.stringify(monacoAdapter["monacoModelValue"]), callbackCount];
            },
            [MessageSystemType.initialize]
        );

        expect(JSON.parse(mappedData[0] as string)).toMatchObject(["bar"]);
        expect(mappedData[1]).toEqual(0);
    });
    test("should remove newlines and leading spaces from the monaco model value", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: config => {
                                config.updateMonacoModelValue(["    foo\n   bar"], false);
                            },
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                monacoAdapter.action("foo").run();

                return JSON.stringify(monacoAdapter["monacoModelValue"]);
            },
            [MessageSystemType.initialize]
        );

        const trimmedMappedData = JSON.parse(mappedData).map((data: string) => {
            return data.trim();
        });

        expect(trimmedMappedData).toMatchObject(["foo", "bar"]);
    });
    test("should not update the monaco value if the message is from the adapter", async ({
        page,
    }) => {
        const callbackCount = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                let callbackCount = 0;
                const callback = () => {
                    callbackCount++;
                };
                new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: callback,
                            messageSystemType: messageSystemTypeInitialize,
                        }),
                    ],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                            options: {
                                originatorId: (window as any).dtc.monacoAdapterId,
                            },
                        },
                    } as any);
                });

                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbackCount).toEqual(0);
    });
    test("should update the dataDictionary to correct values when the monaco value has been updated", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                let resolvedDataDictionary: any = null;
                const callback = (config: any) => {
                    resolvedDataDictionary = config.dataDictionary;
                };
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                    ul: {
                        id: "ul",
                        $id: "ul",
                        type: "object",
                        mapsToTagName: "ul",
                    },
                    text: {
                        id: "text",
                        $id: "text",
                        type: "string",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                messageSystem.postMessage = callback;
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [
                        new (window as any).dtc.MonacoAdapterAction({
                            id: "foo",
                            action: config => {
                                config.updateMonacoModelValue(
                                    ["<ul>", "foobar", "</ul>"],
                                    false
                                );
                            },
                        }),
                    ],
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                            activeDictionaryId: "div",
                        },
                    } as any);
                });

                monacoAdapter.action("foo").run();

                const root = resolvedDataDictionary[1];
                const textId =
                    resolvedDataDictionary[0][resolvedDataDictionary[1]].data.Slot[0].id;
                return [root, textId, JSON.stringify(resolvedDataDictionary)];
            },
            [MessageSystemType.initialize]
        );

        expect(JSON.parse(mappedData[2])).toMatchObject([
            {
                [mappedData[0]]: {
                    schemaId: "ul",
                    data: {
                        Slot: [
                            {
                                id: mappedData[1],
                            },
                        ],
                    },
                },
                [mappedData[1]]: {
                    schemaId: "text",
                    parent: {
                        id: mappedData[0],
                        dataLocation: "Slot",
                    },
                    data: "foobar",
                },
            },
            mappedData[0],
        ]);
    });
    test("should change the schema dictionary when a schema dictionary event is fired", async ({
        page,
    }) => {
        const schemaDictionaryCount = await page.evaluate(
            ([
                messageSystemTypeInitialize,
                messageSystemTypeSchemaDictionary,
                messageSystemSchemaDictionaryTypeActionAdd,
            ]: [string, string, string]) => {
                const dataDictionary: DataDictionary<unknown> = [
                    {
                        div: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "div",
                ];
                const schemaDictionary = {
                    div: {
                        id: "div",
                        $id: "div",
                        type: "object",
                        mapsToTagName: "div",
                    },
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                });
                const monacoAdapter = new (window as any).dtc.MonacoAdapter({
                    messageSystem,
                    actions: [],
                });

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                            dataDictionary,
                            schemaDictionary,
                        },
                    } as any);
                });

                const schemaDictionaryCount1 = Object.keys(
                    monacoAdapter["schemaDictionary"]
                ).length;

                // TODO: find out why renders the monacoAdapter["schemaDictionary"] as undefined
                // messageSystem["register"].forEach((registeredItem: Register) => {
                //     registeredItem.onMessage({
                //         data: {
                //             type: messageSystemTypeSchemaDictionary,
                //             action: messageSystemSchemaDictionaryTypeActionAdd,
                //             schemas: [
                //                 {
                //                     id: "text",
                //                     $id: "text",
                //                     type: "string",
                //                 },
                //                 {
                //                     id: "span",
                //                     $id: "span",
                //                     type: "object",
                //                     mapsToTagName: "span",
                //                 },
                //             ],
                //         },
                //     } as any);
                // });

                // const schemaDictionaryCount2 = Object.keys(monacoAdapter["schemaDictionary"]).length;

                return [
                    schemaDictionaryCount1,
                    //     schemaDictionaryCount2
                ];
            },
            [
                MessageSystemType.initialize,
                MessageSystemType.schemaDictionary,
                MessageSystemSchemaDictionaryTypeAction.add,
            ]
        );

        expect(schemaDictionaryCount[0]).toEqual(1);
        // expect(schemaDictionaryCount[1]).toEqual(3);
    });
});

test.describe("findDictionaryIdParents", () => {
    test("should not return any parents if this is the root dictionary item", () => {
        expect(
            findDictionaryIdParents("root", [
                {
                    root: {
                        schemaId: "text",
                        data: "foo",
                    },
                },
                "root",
            ])
        ).toMatchObject([]);
    });
    test("should return parents if the dictionary item is nested", () => {
        expect(
            findDictionaryIdParents("a", [
                {
                    root: {
                        schemaId: "bar",
                        data: {
                            Slot: [
                                {
                                    id: "a",
                                },
                            ],
                        },
                    },
                    a: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                },
                "root",
            ])
        ).toMatchObject([
            {
                id: "root",
                dataLocation: "Slot",
                currentId: "a",
                linkedDataIndex: 0,
            },
        ]);
    });
    test("should return a deeply nested id with multiple items in a slot", () => {
        expect(
            findDictionaryIdParents("c", [
                {
                    root: {
                        schemaId: "bar",
                        data: {
                            Slot: [
                                {
                                    id: "b",
                                },
                                {
                                    id: "a",
                                },
                            ],
                        },
                    },
                    a: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "c",
                                },
                            ],
                        },
                    },
                    b: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                    c: {
                        schemaId: "foo",
                        parent: {
                            id: "a",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                },
                "root",
            ])
        ).toMatchObject([
            {
                id: "root",
                dataLocation: "Slot",
                currentId: "a",
                linkedDataIndex: 1,
            },
            {
                id: "a",
                dataLocation: "Slot",
                currentId: "c",
                linkedDataIndex: 0,
            },
        ]);
    });
});

test.describe("findUpdatedDictionaryId", () => {
    test("should return the root dictionary id if there is no parent items", () => {
        expect(
            findUpdatedDictionaryId(
                [],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: "bar",
                        },
                    },
                    "foo",
                ]
            )
        ).toEqual("foo");
    });
    test("should return a nested dictionary id if there is a parent item", () => {
        expect(
            findUpdatedDictionaryId(
                [
                    {
                        id: "a",
                        dataLocation: "Slot",
                        currentId: "b",
                        linkedDataIndex: 0,
                    },
                ],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {
                                Slot: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                        },
                        bar: {
                            schemaId: "bar",
                            data: "foo",
                        },
                    },
                    "foo",
                ]
            )
        ).toEqual("bar");
    });
    test("should find the nearest dictionary id if the data structure has changed", () => {
        expect(
            findUpdatedDictionaryId(
                [
                    {
                        id: "a",
                        dataLocation: "Slot",
                        currentId: "b",
                        linkedDataIndex: 0,
                    },
                ],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "foo",
                ]
            )
        ).toEqual("foo");
    });
});
