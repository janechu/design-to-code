import { expect, test } from "../__test__/base-fixtures.js";
import { MessageSystemType, Register } from "../message-system/index.js";
import { ShortcutsConfig, shortcutsId } from "./shortcuts.service.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe("Shortcuts", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system.html");
    });
    test("should not throw", async ({ page }) => {
        const shouldNotError = await page.evaluate(() => {
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

            new (window as any).dtc.Shortcuts({
                messageSystem,
                target: document.body,
            });

            return true;
        });
        expect(shouldNotError).toEqual(true);
    });
    test("should not throw if the message system is undefined", async ({ page }) => {
        const shouldNotError = await page.evaluate(() => {
            new (window as any).dtc.Shortcuts({
                messageSystem: undefined,
                target: document.body,
            });

            return true;
        });
        expect(shouldNotError).toEqual(true);
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
            new (window as any).dtc.Shortcuts({
                messageSystem,
                target: document.body,
            });

            return [size1, messageSystem["register"].size];
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

            const shortcuts = new (window as any).dtc.Shortcuts({
                messageSystem,
                target: document.body,
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
    test("should add registered actions to a list of actions", async ({ page }) => {
        const registeredActions = await page.evaluate(() => {
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

            const shortcutAction = () => {};
            const actions = [
                new (window as any).dtc.ShortcutsAction({
                    id: "foo",
                    name: "Foo",
                    keys: [
                        {
                            metaKey: true,
                        },
                    ],
                    action: shortcutAction,
                }),
            ];
            const shortcuts = new (window as any).dtc.Shortcuts({
                messageSystem,
                actions,
                target: document.body,
            });

            return [shortcuts["registeredActions"], JSON.stringify(actions)];
        });

        expect(registeredActions[0]).toEqual(JSON.parse(registeredActions[1]));
    });
    test("should send a message via the message system that shortcuts have been registered", async ({
        page,
    }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                let callbackArgs = null;
                let callbackCount = 0;
                const postMessageCallback: any = (config: any) => {
                    callbackArgs = config;
                    callbackCount++;
                };
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                const shortcutAction = () => {};
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                metaKey: true,
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });

                return [
                    callbackCount,
                    callbackArgs.type,
                    callbackArgs.id,
                    callbackArgs.action,
                ];
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks[0]).toEqual(1);
        expect(callbacks[1]).toEqual(MessageSystemType.custom);
        expect(callbacks[2]).toEqual(shortcutsId);
        expect(callbacks[3]).toEqual("initialize");
    });
    test("should pass meta key if meta key is used", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                metaKey: true,
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    metaKey: true,
                } as any);

                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(1);
    });
    test("should pass alt key if alt key is used", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                altKey: true,
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    altKey: true,
                } as any);
                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(1);
    });
    test("should pass ctrl key if ctrl key is used", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                ctrlKey: true,
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    ctrlKey: true,
                } as any);
                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(1);
    });
    test("should pass shift key if shift key is used", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                shiftKey: true,
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    shiftKey: true,
                } as any);
                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(1);
    });
    test("should pass a specific key if a specific key is used", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                value: "d",
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    key: "d",
                } as any);
                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(1);
    });
    test("should not invoke an action if the keys do not match", async ({ page }) => {
        const callbacks = await page.evaluate(
            ([messageSystemTypeInitialize]: [string]) => {
                const postMessageCallback: any = () => {};
                const messageSystem = new (window as any).dtc.MessageSystem({
                    webWorker: "",
                    dataDictionary: null,
                    schemaDictionary: null,
                });
                messageSystem.postMessage = postMessageCallback;
                let callbackCount = 0;
                const shortcutAction = () => {
                    callbackCount++;
                };
                const actions = [
                    new (window as any).dtc.ShortcutsAction({
                        id: "foo",
                        name: "Foo",
                        keys: [
                            {
                                value: "e",
                            },
                        ],
                        action: shortcutAction,
                    }),
                ];
                new (window as any).dtc.Shortcuts({
                    messageSystem,
                    actions,
                    target: document.body,
                });
                messageSystem["register"].forEach((registeredItem: Register) => {
                    registeredItem.onMessage({
                        data: {
                            type: messageSystemTypeInitialize,
                        },
                    } as any);
                });
                (
                    messageSystem.getConfigById(
                        (window as any).dtc.shortcutsId
                    ) as ShortcutsConfig
                ).eventListener({
                    key: "d",
                } as any);
                return callbackCount;
            },
            [MessageSystemType.initialize]
        );

        expect(callbacks).toEqual(0);
    });
    test("should run an action if the id matches", async ({ page }) => {
        const callbacks = await page.evaluate(() => {
            const postMessageCallback: any = () => {};
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            let callbackCount = 0;
            const shortcutAction = () => {
                callbackCount++;
            };
            const actions = [
                new (window as any).dtc.ShortcutsAction({
                    id: "foo",
                    name: "Foo",
                    keys: [
                        {
                            value: "d",
                        },
                    ],
                    action: shortcutAction,
                }),
                new (window as any).dtc.ShortcutsAction({
                    id: "bat",
                    name: "Bat",
                    keys: [
                        {
                            value: "c",
                        },
                    ],
                    action: shortcutAction,
                }),
            ];
            const shortcuts = new (window as any).dtc.Shortcuts({
                messageSystem,
                actions,
                target: document.body,
            });
            shortcuts.action("foo").run();

            return callbackCount;
        });

        expect(callbacks).toEqual(1);
    });
    test("should not run an action if the id does not match", async ({ page }) => {
        const shouldThrow = await page.evaluate(() => {
            const postMessageCallback: any = () => {};
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            const shortcutAction = () => {};
            const actions = [
                new (window as any).dtc.ShortcutsAction({
                    id: "foo",
                    name: "Foo",
                    keys: [
                        {
                            value: "d",
                        },
                    ],
                    action: shortcutAction,
                }),
                new (window as any).dtc.ShortcutsAction({
                    id: "bat",
                    name: "Bat",
                    keys: [
                        {
                            value: "c",
                        },
                    ],
                    action: shortcutAction,
                }),
            ];
            const shortcuts = new (window as any).dtc.Shortcuts({
                messageSystem,
                actions,
                target: document.body,
            });

            try {
                shortcuts.action("bar").run();
            } catch (e) {
                return true;
            }
        });

        expect(shouldThrow).toEqual(true);
    });
});
