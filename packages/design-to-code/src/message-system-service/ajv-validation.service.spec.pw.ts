import { expect, test } from "@playwright/test";
import {
    AddLinkedDataDataMessageOutgoing,
    DataDictionary,
    DuplicateDataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemDataTypeAction,
    MessageSystemType,
    NavigationConfig,
    NavigationConfigDictionary,
    Register,
    RemoveLinkedDataDataMessageOutgoing,
    SchemaSetValidationAction,
    UpdateDataMessageOutgoing,
} from "../message-system/index.js";
import { DataType } from "../data-utilities/types.js";
import { AjvMapper, ajvValidationId } from "./ajv-validation.service.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe("AjvMapper", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system");
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

            new (window as any).dtc.AjvMapper({
                messageSystem,
            });

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should not throw if the message system is undefined", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            new (window as any).dtc.AjvMapper({
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

            new (window as any).dtc.AjvMapper({
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

            const ajvMapper = new (window as any).dtc.AjvMapper({
                messageSystem,
            });

            const size2 = messageSystem["register"].size;

            ajvMapper.destroy();

            const size3 = messageSystem["register"].size;

            return [size1, size2, size3];
        });

        expect(sizes[0]).toEqual(0);
        expect(sizes[1]).toEqual(1);
        expect(sizes[2]).toEqual(0);
    });
    test("should call the message callback if an initialize message has been sent", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([dataTypeObject, messageTypeInitialize]: [DataType, MessageSystemType]) => {
                const schema: any = {
                    $id: "foo",
                };
                const data = undefined;
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: [
                        {
                            foo: {
                                schemaId: schema.$id,
                                data: undefined,
                            },
                        },
                        "foo",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                });

                const ajvMapper = new (window as any).dtc.AjvMapper({
                    messageSystem,
                });

                const navigation: NavigationConfig = [
                    {
                        foo: {
                            self: "foo",
                            parent: null,
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema,
                            disabled: false,
                            data,
                            text: "foo",
                            type: dataTypeObject,
                            items: [],
                        },
                    },
                    "foo",
                ];

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageTypeInitialize,
                            activeDictionaryId: "foo",
                            activeNavigationConfigId: "foo",
                            schema,
                            data,
                            dataDictionary: [
                                {
                                    foo: {
                                        schemaId: "foo",
                                        data,
                                    },
                                },
                                "foo",
                            ],
                            navigationDictionary: [
                                {
                                    foo: navigation,
                                },
                                "foo",
                            ],
                            navigation,
                            schemaDictionary: {
                                foo: schema,
                            },
                            validation: {},
                            activeHistoryIndex: 0,
                            dictionaryId: "foo",
                            historyId: "1",
                            historyLimit: 30,
                        } as InitializeMessageOutgoing,
                    } as any);
                });

                return ajvMapper["validation"]["foo"];
            },
            [DataType.object, MessageSystemType.initialize]
        );

        expect(mappedData).toMatchObject([]);
    });
    test("should convert ajv errors to the error format expected by the message system", async ({
        page,
    }) => {
        const mappedData = await page.evaluate(
            ([dataTypeObject, messageTypeInitialize]: [DataType, MessageSystemType]) => {
                const schema: any = {
                    $schema: "http://json-schema.org/schema#",
                    $id: "foo",
                    type: "string",
                };
                const data = 42;
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: [
                        {
                            foo: {
                                schemaId: schema.$id,
                                data: undefined,
                            },
                        },
                        "foo",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                });

                const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                    messageSystem,
                });

                const navigation: NavigationConfig = [
                    {
                        foo: {
                            self: "foo",
                            parent: null,
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema,
                            disabled: false,
                            data,
                            text: "foo",
                            type: dataTypeObject,
                            items: [],
                        },
                    },
                    "foo",
                ];

                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageTypeInitialize,
                            activeDictionaryId: "foo",
                            activeNavigationConfigId: "foo",
                            schema,
                            data,
                            dataDictionary: [
                                {
                                    foo: {
                                        schemaId: "foo",
                                        data,
                                    },
                                },
                                "foo",
                            ],
                            navigationDictionary: [
                                {
                                    foo: navigation,
                                },
                                "foo",
                            ],
                            navigation,
                            schemaDictionary: {
                                foo: schema,
                            },
                            validation: {},
                            activeHistoryIndex: 0,
                            dictionaryId: "foo",
                            historyId: "1",
                            historyLimit: 30,
                        } as InitializeMessageOutgoing,
                    } as any);
                });

                return JSON.stringify(ajvMapper["validation"]["foo"]);
            },
            [DataType.object, MessageSystemType.initialize]
        );

        expect(JSON.parse(mappedData)).toMatchObject([
            {
                dataLocation: "",
                invalidMessage: "should be string",
            },
        ]);
    });
    test.describe("should call the message callback if a data message has been sent", async () => {
        const schema: any = {
            $schema: "http://json-schema.org/schema#",
            $id: "foo",
            type: "string",
        };
        const schemaAsString = JSON.stringify(schema);
        const data = 42;
        const dataDictionary: DataDictionary<unknown> = [
            {
                foo: {
                    schemaId: schema.$id,
                    data,
                },
            },
            "foo",
        ];
        const dataDictionaryAsString = JSON.stringify(dataDictionary);
        const navigation: NavigationConfig = [
            {
                foo: {
                    self: "foo",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "foo",
                    type: DataType.object,
                    items: [],
                },
            },
            "foo",
        ];
        const navigationAsString = JSON.stringify(navigation);
        const navigationDictionary: NavigationConfigDictionary = [
            {
                foo: navigation,
            },
            "foo",
        ];
        const navigationDictionaryAsString = JSON.stringify(navigationDictionary);

        test("with action type 'add'", async ({ page }) => {
            const mappedData = await page.evaluate(
                ([
                    messageTypeInitialize,
                    messageTypeData,
                    messageActionTypeUpdate,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]: [
                    MessageSystemType,
                    MessageSystemType,
                    MessageSystemDataTypeAction,
                    number,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const dataDictionary = JSON.parse(dataDictionaryAsString);
                    const schema = JSON.parse(schemaAsString);
                    const navigation = JSON.parse(navigationAsString);
                    const navigationDictionary = JSON.parse(navigationDictionaryAsString);
                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary,
                        schemaDictionary: {
                            foo: schema,
                        },
                    });
                    const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageTypeInitialize,
                                activeDictionaryId: "foo",
                                activeNavigationConfigId: "foo",
                                schema,
                                data,
                                dataDictionary,
                                navigationDictionary,
                                navigation,
                                schemaDictionary: {
                                    foo: schema,
                                },
                                validation: {},
                                activeHistoryIndex: 0,
                                dictionaryId: "foo",
                                historyId: "1",
                                historyLimit: 30,
                            } as InitializeMessageOutgoing,
                        } as any);
                    });
                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageTypeData,
                                action: messageActionTypeUpdate,
                                data,
                                dataDictionary,
                                navigation,
                                navigationDictionary,
                            } as UpdateDataMessageOutgoing,
                        } as any);
                    });

                    return JSON.stringify(ajvMapper["validation"]["foo"]);
                },
                [
                    MessageSystemType.initialize,
                    MessageSystemType.data,
                    MessageSystemDataTypeAction.update,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]
            );

            expect(JSON.parse(mappedData)).toMatchObject([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("with action type 'addLinkedData'", async ({ page }) => {
            const mappedData = await page.evaluate(
                ([
                    dataTypeBoolean,
                    messageSystemTypeData,
                    messageSystemDataTypeActionAddLinkedData,
                    messageSystemTypeInitialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]: [
                    DataType,
                    MessageSystemType,
                    MessageSystemDataTypeAction,
                    MessageSystemType,
                    number,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const dataDictionary = JSON.parse(dataDictionaryAsString);
                    const schema = JSON.parse(schemaAsString);
                    const navigation = JSON.parse(navigationAsString);
                    const navigationDictionary = JSON.parse(navigationDictionaryAsString);
                    const schema2: any = {
                        $schema: "http://json-schema.org/schema#",
                        $id: "bar",
                        type: "boolean",
                    };
                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary,
                        schemaDictionary: {
                            foo: schema,
                            bar: schema2,
                        },
                    });
                    const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeInitialize,
                                activeDictionaryId: "foo",
                                activeNavigationConfigId: "foo",
                                schema,
                                data,
                                dataDictionary,
                                navigationDictionary,
                                navigation,
                                schemaDictionary: {
                                    foo: schema,
                                },
                                validation: {},
                                activeHistoryIndex: 0,
                                dictionaryId: "foo",
                                historyId: "1",
                                historyLimit: 30,
                            } as InitializeMessageOutgoing,
                        } as any);
                    });
                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeData,
                                action: messageSystemDataTypeActionAddLinkedData,
                                data: "foo",
                                dictionaryId: "bar",
                                linkedDataIds: [],
                                dataDictionary,
                                navigation: [
                                    {
                                        bar: {
                                            self: "bar",
                                            parent: "foo",
                                            relativeDataLocation: "",
                                            schemaLocation: "",
                                            schema: schema2,
                                            disabled: false,
                                            data: "foo",
                                            text: "",
                                            type: dataTypeBoolean,
                                            items: [],
                                        },
                                    },
                                    "bar",
                                ],
                                activeHistoryIndex: 0,
                                historyId: "1",
                                validation: {},
                                activeNavigationConfigId: "",
                                activeDictionaryId: "bar",
                                schemaDictionary: {},
                                navigationDictionary,
                            } as AddLinkedDataDataMessageOutgoing,
                        } as any);
                    });

                    return JSON.stringify(ajvMapper["validation"]["bar"]);
                },
                [
                    DataType.boolean,
                    MessageSystemType.data,
                    MessageSystemDataTypeAction.addLinkedData,
                    MessageSystemType.initialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]
            );

            expect(JSON.parse(mappedData)).toMatchObject([
                {
                    dataLocation: "",
                    invalidMessage: "should be boolean",
                },
            ]);
        });
        test("with action type 'duplicate'", async ({ page }) => {
            const mappedData = await page.evaluate(
                ([
                    messageSystemTypeData,
                    messageSystemDataTypeActionDuplicate,
                    messageSystemTypeInitialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]: [
                    MessageSystemType,
                    MessageSystemDataTypeAction,
                    MessageSystemType,
                    number,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const dataDictionary = JSON.parse(dataDictionaryAsString);
                    const schema = JSON.parse(schemaAsString);
                    const navigation = JSON.parse(navigationAsString);
                    const navigationDictionary = JSON.parse(navigationDictionaryAsString);

                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary,
                        schemaDictionary: {
                            foo: schema,
                        },
                    });
                    const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeInitialize,
                                activeDictionaryId: "foo",
                                activeNavigationConfigId: "foo",
                                schema,
                                data,
                                dataDictionary,
                                navigationDictionary,
                                navigation,
                                schemaDictionary: {
                                    foo: schema,
                                },
                                activeHistoryIndex: 0,
                                dictionaryId: "foo",
                                historyId: "1",
                                validation: {},
                                historyLimit: 30,
                            } as InitializeMessageOutgoing,
                        } as any);
                    });
                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeData,
                                action: messageSystemDataTypeActionDuplicate,
                                data,
                                dataDictionary,
                                navigation,
                                navigationDictionary,
                            } as DuplicateDataMessageOutgoing,
                        } as any);
                    });

                    return JSON.stringify(ajvMapper["validation"]["foo"]);
                },
                [
                    MessageSystemType.data,
                    MessageSystemDataTypeAction.duplicate,
                    MessageSystemType.initialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]
            );

            expect(JSON.parse(mappedData)).toMatchObject([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("with action type 'update'", async ({ page }) => {
            const mappedData = await page.evaluate(
                ([
                    messageSystemTypeData,
                    messageSystemDataTypeActionUpdate,
                    messageSystemTypeInitialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]: [
                    MessageSystemType,
                    MessageSystemDataTypeAction,
                    MessageSystemType,
                    number,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const dataDictionary = JSON.parse(dataDictionaryAsString);
                    const schema = JSON.parse(schemaAsString);
                    const navigation = JSON.parse(navigationAsString);
                    const navigationDictionary = JSON.parse(navigationDictionaryAsString);

                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary,
                        schemaDictionary: {
                            foo: schema,
                        },
                    });
                    const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeInitialize,
                                activeDictionaryId: "foo",
                                activeNavigationConfigId: "foo",
                                schema,
                                data,
                                dataDictionary,
                                navigationDictionary,
                                navigation,
                                schemaDictionary: {
                                    foo: schema,
                                },
                                activeHistoryIndex: 0,
                                dictionaryId: "foo",
                                historyId: "1",
                                validation: {},
                                historyLimit: 30,
                            } as InitializeMessageOutgoing,
                        } as any);
                    });
                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeData,
                                action: messageSystemDataTypeActionUpdate,
                                data,
                                dataDictionary,
                                navigation,
                                navigationDictionary,
                            } as UpdateDataMessageOutgoing,
                        } as any);
                    });

                    return JSON.stringify(ajvMapper["validation"]["foo"]);
                },
                [
                    MessageSystemType.data,
                    MessageSystemDataTypeAction.update,
                    MessageSystemType.initialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]
            );

            expect(JSON.parse(mappedData)).toMatchObject([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("without action type 'removeLinkedData'", async ({ page }) => {
            const mappedData = await page.evaluate(
                ([
                    messageSystemTypeData,
                    messageSystemDataTypeActionRemoveLinkedData,
                    messageSystemTypeInitialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]: [
                    MessageSystemType,
                    MessageSystemDataTypeAction,
                    MessageSystemType,
                    number,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const dataDictionary = JSON.parse(dataDictionaryAsString);
                    const schema = JSON.parse(schemaAsString);
                    const navigation = JSON.parse(navigationAsString);
                    const navigationDictionary = JSON.parse(navigationDictionaryAsString);

                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary,
                        schemaDictionary: {
                            foo: schema,
                        },
                    });
                    const ajvMapper: AjvMapper = new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeInitialize,
                                activeDictionaryId: "foo",
                                activeNavigationConfigId: "foo",
                                schema,
                                data,
                                dataDictionary,
                                navigationDictionary,
                                navigation,
                                schemaDictionary: {
                                    foo: schema,
                                },
                                activeHistoryIndex: 0,
                                dictionaryId: "foo",
                                historyId: "1",
                                validation: {},
                                historyLimit: 30,
                            } as InitializeMessageOutgoing,
                        } as any);
                    });
                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: {
                                type: messageSystemTypeData,
                                action: messageSystemDataTypeActionRemoveLinkedData,
                                data,
                                dataDictionary,
                                navigation,
                                navigationDictionary,
                            } as RemoveLinkedDataDataMessageOutgoing,
                        } as any);
                    });

                    return JSON.stringify(ajvMapper["validation"]["foo"]);
                },
                [
                    MessageSystemType.data,
                    MessageSystemDataTypeAction.removeLinkedData,
                    MessageSystemType.initialize,
                    data,
                    dataDictionaryAsString,
                    schemaAsString,
                    navigationAsString,
                    navigationDictionaryAsString,
                ]
            );

            expect(JSON.parse(mappedData)).toMatchObject([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
    });
    test.describe("should call the message callback if a custom validation message has been sent", async () => {
        const containsValidSchema: any[] = [
            {
                $schema: "http://json-schema.org/schema#",
                id: "bar",
                type: "string",
            },
            {
                $schema: "http://json-schema.org/schema#",
                id: "foo",
                type: "number",
            },
        ];
        const containsValidSchemaAsString = JSON.stringify(containsValidSchema);
        const containsInvalidSchema: any[] = [
            {
                $schema: "http://json-schema.org/schema#",
                id: "bar",
                type: "string",
            },
            {
                $schema: "http://json-schema.org/schema#",
                id: "foo",
                type: "boolean",
            },
        ];
        const containsInvalidSchemaAsString = JSON.stringify(containsInvalidSchema);
        const data = 42;

        test("with action type 'request' when there is a valid schema in the schema set", async ({
            page,
        }) => {
            const id: string = "foobarbat";
            const callbackDataAsString = await page.evaluate(
                ([
                    containsValidSchemaAsString,
                    messageSystemTypeCustom,
                    schemaSetValidationActionRequest,
                    dataAsString,
                    id,
                ]: [string, string, string, string, string]) => {
                    const data = JSON.parse(dataAsString);
                    const containsValidSchema = JSON.parse(containsValidSchemaAsString);

                    const callbackData = [];
                    const postMessageCallback: any = e => {
                        callbackData.push(e);
                    };
                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary: null,
                        schemaDictionary: null,
                    });
                    messageSystem.postMessage = postMessageCallback;
                    new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });
                    messageSystem.add({
                        onMessage: () => {},
                    });
                    const requestMessage: any = {
                        type: messageSystemTypeCustom,
                        action: schemaSetValidationActionRequest,
                        id,
                        schemas: containsValidSchema,
                        data,
                    };

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: requestMessage,
                        } as any);
                    });

                    return JSON.stringify(callbackData);
                },
                [
                    containsValidSchemaAsString,
                    MessageSystemType.custom,
                    SchemaSetValidationAction.request,
                    data,
                    id,
                ]
            );

            const callbackData = JSON.parse(callbackDataAsString);

            expect(callbackData.length).toEqual(1);
            expect(callbackData[0]).toMatchObject({
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: 1,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        });
        test("with action type 'request' when there is no valid schema in the schema set", async ({
            page,
        }) => {
            const id: string = "foobarbat";
            const callbackDataAsString = await page.evaluate(
                ([
                    containsInvalidSchemaAsString,
                    messageSystemTypeCustom,
                    schemaSetValidationActionRequest,
                    dataAsString,
                    id,
                ]: [string, string, string, string, string]) => {
                    const containsInvalidSchema = JSON.parse(
                        containsInvalidSchemaAsString
                    );
                    const data = JSON.parse(dataAsString);
                    const callbackData = [];
                    const postMessageCallback: any = e => {
                        callbackData.push(e);
                    };
                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary: null,
                        schemaDictionary: null,
                    });
                    messageSystem.postMessage = postMessageCallback;
                    new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });
                    messageSystem.add({
                        onMessage: () => {},
                    });
                    const requestMessage: any = {
                        type: messageSystemTypeCustom,
                        action: schemaSetValidationActionRequest,
                        id,
                        schemas: containsInvalidSchema,
                        data,
                    };

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: requestMessage,
                        } as any);
                    });

                    return JSON.stringify(callbackData);
                },
                [
                    containsInvalidSchemaAsString,
                    MessageSystemType.custom,
                    SchemaSetValidationAction.request,
                    data,
                    id,
                ]
            );

            const callbackData = JSON.parse(callbackDataAsString);

            expect(callbackData).toHaveLength(1);
            expect(callbackData[0]).toMatchObject({
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: -1,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        });
        test("with action type that is not 'request'", async ({ page }) => {
            const id: string = "foobarbat";
            const callbackDataAsString = await page.evaluate(
                ([messageSystemTypeCustom, schemaSetValidationActionResponse, id]: [
                    string,
                    string,
                    string,
                    string,
                    string
                ]) => {
                    const callbackData = [];
                    const postMessageCallback: any = e => {
                        callbackData.push(e);
                    };
                    const messageSystem = new (window as any).dtc.MessageSystem({
                        webWorker: "",
                        dataDictionary: null,
                        schemaDictionary: null,
                    });
                    messageSystem.postMessage = postMessageCallback;
                    new (window as any).dtc.AjvMapper({
                        messageSystem,
                    });
                    messageSystem.add({
                        onMessage: () => {},
                    });
                    const responseMessage: any = {
                        type: messageSystemTypeCustom,
                        action: schemaSetValidationActionResponse,
                        id,
                        index: -1,
                    };

                    messageSystem["register"].forEach((registeredItem: Register) => {
                        registeredItem.onMessage({
                            data: responseMessage,
                        } as any);
                    });

                    return JSON.stringify(callbackData);
                },
                [MessageSystemType.custom, SchemaSetValidationAction.response, id]
            );

            const callbackData = JSON.parse(callbackDataAsString);

            expect(callbackData).toHaveLength(0);
        });
    });
});
