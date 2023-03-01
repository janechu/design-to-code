import { expect, test } from "@playwright/test";
import type { Register } from "./message-system.props.js";

/* eslint-disable @typescript-eslint/no-empty-function */
test.describe("MessageSystem", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/message-system");
    });
    test("should not throw when Workers are not available", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            (window as any).Worker = void 0;

            new (window as any).dtc.MessageSystem({
                webWorker: "",
            });

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should not throw when the webWorker is a string", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            class Worker {}

            (window as any).Worker = Worker;

            new (window as any).dtc.MessageSystem({
                webWorker: "",
            });

            (window as any).Worker = undefined;

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should not throw when the webWorker is a Worker instance", async ({ page }) => {
        const didNotError = await page.evaluate(() => {
            class Worker {
                constructor(url: string) {
                    url;
                }
                public postMessage: undefined;
                public onmessage: undefined;
                public onmessageerror: undefined;
                public onerror: undefined;
                public terminate: undefined;
                public removeEventListener: undefined;
                public addEventListener: undefined;
                public dispatchEvent: undefined;
            }

            (window as any).Worker = Worker;

            const myWorker: Worker = new Worker("");

            new (window as any).dtc.MessageSystem({
                webWorker: myWorker as any,
            });

            (window as any).Worker = undefined;

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should not throw when attempting to initialize and Workers are not available", async ({
        page,
    }) => {
        const didNotError = await page.evaluate(() => {
            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
            });

            messageSystem.initialize({
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

            return true;
        });

        expect(didNotError).toEqual(true);
    });
    test("should send an initialization message when Workers are available", async ({
        page,
    }) => {
        const count = await page.evaluate(() => {
            let count = 0;
            class Worker {
                public postMessage: any = () => {
                    count++;
                };
            }
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
            });

            messageSystem.initialize({
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

            return count;
        });

        expect(count).toEqual(1);
    });
    test("should add an item to the register", async ({ page }) => {
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

            messageSystem.add({
                onMessage: () => {},
            });

            const size2 = messageSystem["register"].size;

            return [size1, size2];
        });

        expect(sizes[0]).toEqual(0);
        expect(sizes[1]).toEqual(1);
    });
    test("should remove an item from the register", async ({ page }) => {
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
            const config: any = {
                onMessage: () => {},
            };

            messageSystem.add(config);

            const size1 = messageSystem["register"].size;

            messageSystem.remove(config);

            const size2 = messageSystem["register"].size;

            return [size1, size2];
        });

        expect(sizes[0]).toEqual(1);
        expect(sizes[1]).toEqual(0);
    });
    test("should add a worker if there is a Worker available on the window", async ({
        page,
    }) => {
        const instanceOfWorker = await page.evaluate(() => {
            class Worker {
                public postMessage = (): void => void 0;
            }
            (window as any).Worker = Worker;

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

            return messageSystem["worker"] instanceof Worker;
        });

        expect(instanceOfWorker).toEqual(true);
    });
    test("should post a message when the postMessage method is called", async ({
        page,
    }) => {
        const callbackCount = await page.evaluate(() => {
            let count = 0;
            class Worker {
                public postMessage: any = () => {
                    count++;
                };
            }
            (window as any).Worker = Worker;

            const callbackCount1 = count;

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

            const callbackCount2 = count;

            messageSystem.postMessage({
                data: "foo",
            } as any);

            const callbackCount3 = count;

            return [callbackCount1, callbackCount2, callbackCount3];
        });

        expect(callbackCount[0]).toEqual(0);
        expect(callbackCount[1]).toEqual(1);
        expect(callbackCount[2]).toEqual(2);
    });
    test("should not post a message when the postMessage method is called if workers are not available", async ({
        page,
    }) => {
        const callbackCount = await page.evaluate(() => {
            let count = 0;
            class Worker {
                public postMessage: any = () => {
                    count++;
                };
            }
            (window as any).Worker = undefined;
            const myWorker: Worker = new Worker();

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: myWorker as any,
            });

            messageSystem["worker"] = undefined;
            messageSystem.postMessage({
                data: "foo",
            } as any);

            return count;
        });

        expect(callbackCount).toEqual(0);
    });
    test("should store a message uuid if a post message has been called", async ({
        page,
    }) => {
        const messageQueueLength = await page.evaluate(() => {
            class Worker {
                public postMessage: any = () => {};
            }
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
            });
            messageSystem.postMessage({} as any);

            return messageSystem["messageQueue"][1].length;
        });

        expect(messageQueueLength).toEqual(1);
    });
    test("should clear a message uuid if an onmessage has been called", async ({
        page,
    }) => {
        const messageQueueLength = await page.evaluate(() => {
            class Worker {
                public postMessage: any = () => {};
            }
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
            });
            messageSystem.postMessage({} as any);

            messageSystem["onMessage"]({
                data: [["foo", messageSystem["messageQueue"][1][0]]],
            } as any);

            return messageSystem["messageQueue"][1].length;
        });

        expect(messageQueueLength).toEqual(0);
    });
    test("should not clear a message uuid if an onmessage has been called that is not the first uuid available", async ({
        page,
    }) => {
        const messageQueueLength = await page.evaluate(() => {
            const postMessageCallback: any = () => {};
            class Worker {
                public postMessage: any = postMessageCallback;
            }
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
            });
            messageSystem.postMessage({} as any);

            messageSystem["onMessage"]({ data: ["foo", "unmatchableuuid"] } as any);
            return messageSystem["messageQueue"][1].length;
        });

        expect(messageQueueLength).toEqual(1);
    });
    test("should post a message when the onmessage of the worker has been called", async ({
        page,
    }) => {
        const callbacks = await page.evaluate(() => {
            let count = 0;
            const postMessageCallback: any = () => {};
            const onMessageCallback: any = () => {};
            class Worker {
                public postMessage: any = postMessageCallback;
                public onmessage: any = onMessageCallback;
            }
            (window as any).Worker = Worker;

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

            messageSystem.add({
                onMessage: () => {
                    count++;
                },
            });

            const callbackCount1 = count;

            messageSystem["messageQueue"] = [{}, ["bar"]];
            messageSystem["onMessage"]({ data: [["foo", "bar"]] } as any);

            const callbackCount2 = count;

            return [callbackCount1, callbackCount2];
        });

        expect(callbacks[0]).toEqual(0);
        expect(callbacks[1]).toEqual(1);
    });
    test("should set the limit on history items if the historyLimit is set", async ({
        page,
    }) => {
        const historyLimit = await page.evaluate(() => {
            class Worker {}
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                historyLimit: 10,
            });

            return messageSystem["historyLimit"];
        });

        expect(historyLimit).toEqual(10);
    });
    test("should update the limit on history items if the historyLimit is set again", async ({
        page,
    }) => {
        const historyLimit = await page.evaluate(() => {
            const postMessageCallback: any = () => {};
            class Worker {
                public postMessage: any = postMessageCallback;
            }
            (window as any).Worker = Worker;

            const messageSystem = new (window as any).dtc.MessageSystem({
                webWorker: "",
                historyLimit: 10,
            });
            messageSystem.initialize({
                schemaDictionary: {},
                historyLimit: 5,
            });
            return messageSystem["historyLimit"];
        });

        expect(historyLimit).toEqual(5);
    });
    test("should get a config if a registered item with a corresponding id is present", async ({
        page,
    }) => {
        const data: any = {
            data: "bar",
        };
        const messageSystemData = await page.evaluate(
            ([dataAsString]: [string]) => {
                const data = JSON.parse(dataAsString);
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
                const id: string = "foo";
                const config: Register = {
                    id,
                    onMessage: () => {},
                    config: data,
                };

                messageSystem.add(config);

                return [messageSystem["register"].size, messageSystem.getConfigById(id)];
            },
            [JSON.stringify(data)]
        );

        expect(messageSystemData[0]).toEqual(1);
        expect(messageSystemData[1]).toEqual(data);
    });
    test("should return null if no registered item with a corresponding id is present", async ({
        page,
    }) => {
        const messageSystemData = await page.evaluate(() => {
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
            const id: string = "foo";
            const data: any = {
                data: "bar",
            };
            const config: Register = {
                id,
                onMessage: () => {},
                config: data,
            };

            messageSystem.add(config);

            return [messageSystem["register"].size, messageSystem.getConfigById("qux")];
        });

        expect(messageSystemData[0]).toEqual(1);
        expect(messageSystemData[1]).toEqual(null);
    });
});
