import React, { useEffect, useState } from "react";
import {
    DataType,
    linkedDataSchema,
    mapDataDictionary,
    pluginIdKeyword,
} from "design-to-code";
import {
    ComponentDictionary,
    reactMapper,
    reactResolver,
} from "../../src/data-utilities/mapping";

function Foo(props: { children: string; text: string; number: number }) {
    return (
        <div id="foo" data-text={props.text} data-number={props.number}>
            {props.children}
        </div>
    );
}

function Bar(props: { children: string }) {
    return <div id="bar">{props.children}</div>;
}

const componentDictionary: ComponentDictionary = {
    foo: Foo,
    bar: Bar,
};

export function UtilitiesPage() {
    const [content, setContent] = useState(<div>Hello world</div>);

    function mapDataAsProps() {
        const resolvedData = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            text: "Hello",
                            number: 42,
                        },
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    $id: "foo",
                    type: "object",
                    properties: {
                        text: {
                            type: "string",
                        },
                        number: {
                            type: "number",
                        },
                    },
                },
            },
        });
        setContent(resolvedData);
    }

    function mapDataAsChildren() {
        const resolvedData = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            children: [
                                {
                                    id: "bat",
                                },
                                {
                                    id: "bar",
                                },
                            ],
                        },
                    },
                    bar: {
                        schemaId: "bar",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: "Hello world",
                    },
                    bat: {
                        schemaId: "bar",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: "Foo",
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    $id: "foo",
                    type: "object",
                    properties: {
                        children: {
                            ...linkedDataSchema,
                        },
                    },
                },
                bar: {
                    $id: "bar",
                    type: "string",
                },
            },
        });
        setContent(resolvedData);
    }

    function mapDataNested() {
        const resolvedData = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            children: [
                                {
                                    id: "bar",
                                    dataLocation: "children",
                                },
                            ],
                        },
                    },
                    bar: {
                        schemaId: "bar",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: {
                            children: [
                                {
                                    id: "bat",
                                },
                            ],
                        },
                    },
                    bat: {
                        schemaId: "bat",
                        parent: {
                            id: "bar",
                            dataLocation: "children",
                        },
                        data: "Hello world",
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    $id: "foo",
                    type: "object",
                    properties: {
                        children: {
                            ...linkedDataSchema,
                        },
                    },
                },
                bar: {
                    $id: "bar",
                    type: "object",
                    properties: {
                        children: {
                            ...linkedDataSchema,
                        },
                    },
                },
                bat: {
                    $id: "bat",
                    type: DataType.string,
                },
            },
        });
        setContent(resolvedData);
    }

    function mapDataAsPlugin() {
        const pluginId: string = "foobarbat";
        function mapperPlugin(data: any): any {
            return "Hello world, " + data;
        }
        const resolvedData: any = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            text: "!",
                            number: 42,
                        },
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    $id: "foo",
                    type: "object",
                    properties: {
                        text: {
                            [pluginIdKeyword]: pluginId,
                            type: "string",
                        },
                        number: {
                            type: "number",
                        },
                    },
                },
            },
            plugins: [
                {
                    ids: [pluginId],
                    mapper: mapperPlugin,
                    resolver: () => {},
                },
            ],
        });
        setContent(resolvedData);
    }

    function resolveDataAsPlugin() {
        const pluginId: string = "foobarbat";
        function resolverPlugin(data: any): any {
            return "Hello world";
        }
        const resolvedData: any = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            children: [
                                {
                                    id: "bar",
                                    dataLocation: "children",
                                },
                            ],
                        },
                    },
                    bar: {
                        schemaId: "foo",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: {},
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    $id: "foo",
                    type: "object",
                    properties: {
                        children: {
                            ...linkedDataSchema,
                            [pluginIdKeyword]: pluginId,
                        },
                    },
                },
            },
            plugins: [
                {
                    ids: [pluginId],
                    mapper: () => {},
                    resolver: resolverPlugin,
                },
            ],
        });

        setContent(resolvedData);
    }

    function detectTest(e) {
        switch (e.detail) {
            case "mapDataAsProps":
                mapDataAsProps();
                break;
            case "mapDataAsChildren":
                mapDataAsChildren();
                break;
            case "mapDataNested":
                mapDataNested();
                break;
            case "mapDataAsPlugin":
                mapDataAsPlugin();
                break;
            case "resolveDataAsPlugin":
                resolveDataAsPlugin();
                break;
            default:
                return null;
        }
    }

    useEffect(() => {
        // run on first load
        window.addEventListener("test", detectTest);

        return () => {
            window.removeEventListener("test", detectTest);
        };
    }, []);

    return content;
}
