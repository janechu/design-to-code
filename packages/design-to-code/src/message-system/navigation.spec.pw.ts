import { expect, test } from "@playwright/test";
import { DataType } from "../data-utilities/types.js";
import { dictionaryLink } from "../schemas/index.js";
import { getNavigation, getNavigationDictionary } from "./navigation.js";
import { NavigationConfigDictionary } from "./navigation.props.js";

/**
 * Gets the navigation
 */
test.describe("getNavigation", () => {
    test("should get a single navigation object from a schema with type object", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.object,
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });
        expect(Object.keys(navigation[0])).toHaveLength(1);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            parentDictionaryItem: undefined,
            data: undefined,
            relativeDataLocation: "",
            schema: {
                $id: "foo",
                title: "bar",
                type: "object",
            },
            disabled: false,
            schemaLocation: "",
            text: "bar",
            type: DataType.object,
            items: [],
        });
    });
    test("should get a single navigation object from a schema with type boolean", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.boolean,
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(Object.keys(navigation[0])).toHaveLength(1);
        expect(navigation[0][navigation[1]].type).toEqual(DataType.boolean);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
    });
    test("should get a single navigation object from a schema with type null", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.null,
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(Object.keys(navigation[0])).toHaveLength(1);
        expect(navigation[0][navigation[1]].type).toEqual(DataType.null);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
    });
    test("should get a single navigation object from a schema with type array", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.array,
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(Object.keys(navigation[0])).toHaveLength(1);
        expect(navigation[0][navigation[1]].type).toEqual(DataType.array);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
    });
    test("should get a single navigation object from a schema with type string", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.string,
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(Object.keys(navigation[0])).toHaveLength(1);
        expect(navigation[0][navigation[1]].type).toEqual(DataType.string);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
    });
    test("should get a navigation object from a schema with type object and properties", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.object,
            properties: {
                bat: {
                    title: "baz",
                    type: DataType.string,
                },
            },
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(Object.keys(navigation[0])).toHaveLength(2);
        expect(navigation[0][navigation[1]].type).toEqual(DataType.object);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
        expect(navigation[0]["bat"].type).toEqual(DataType.string);
        expect(navigation[0]["bat"].schema).toMatchObject(schema.properties.bat);
    });
    test("should get a navigation object from a schema with type array and data", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.array,
            items: {
                title: "bat",
                type: DataType.string,
            },
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            ["hello", "world"]
        );

        expect(Object.keys(navigation[0])).toHaveLength(3);
        expect(navigation[0][navigation[1]].data).toHaveLength(2);
        expect(navigation[0][navigation[1]].data[0]).toEqual("hello");
        expect(navigation[0][navigation[1]].data[1]).toEqual("world");
        expect(navigation[0]["[0]"].data).toEqual("hello");
        expect(navigation[0]["[0]"].type).toEqual(DataType.string);
        expect(navigation[0]["[1]"].data).toEqual("world");
        expect(navigation[0]["[1]"].type).toEqual(DataType.string);
    });
    test("should get a navigation object from a schema with type array and nested arrays", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.array,
            items: {
                title: "bat",
                type: DataType.array,
                items: {
                    title: "baz",
                    type: DataType.string,
                },
            },
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            [
                ["HelloA", "WorldA"],
                ["HelloB", "WorldB"],
            ]
        );

        expect(Object.keys(navigation[0])).toHaveLength(7);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            relativeDataLocation: "",
            schemaLocation: "",
            schema,
            disabled: false,
            data: [
                ["HelloA", "WorldA"],
                ["HelloB", "WorldB"],
            ],
            text: "bar",
            type: "array",
            items: ["[0]", "[1]"],
        });
        expect(navigation[0]["[0]"]).toMatchObject({
            self: "[0]",
            parent: "",
            relativeDataLocation: "[0]",
            schemaLocation: "items",
            schema: schema.items,
            disabled: false,
            data: ["HelloA", "WorldA"],
            text: "bat",
            type: "array",
            items: ["[0][0]", "[0][1]"],
        });
        expect(navigation[0]["[1]"]).toMatchObject({
            self: "[1]",
            parent: "",
            relativeDataLocation: "[1]",
            schemaLocation: "items",
            schema: schema.items,
            disabled: false,
            data: ["HelloB", "WorldB"],
            text: "bat",
            type: "array",
            items: ["[1][0]", "[1][1]"],
        });
        expect(navigation[0]["[0][0]"]).toMatchObject({
            self: "[0][0]",
            parent: "[0]",
            relativeDataLocation: "[0][0]",
            schemaLocation: "items.items",
            schema: schema.items.items,
            disabled: false,
            data: "HelloA",
            text: "baz",
            type: "string",
            items: [],
        });
        expect(navigation[0]["[0][1]"]).toMatchObject({
            self: "[0][1]",
            parent: "[0]",
            relativeDataLocation: "[0][1]",
            schemaLocation: "items.items",
            schema: schema.items.items,
            disabled: false,
            data: "WorldA",
            text: "baz",
            type: "string",
            items: [],
        });
        expect(navigation[0]["[1][0]"]).toMatchObject({
            self: "[1][0]",
            parent: "[1]",
            relativeDataLocation: "[1][0]",
            schemaLocation: "items.items",
            schema: schema.items.items,
            disabled: false,
            data: "HelloB",
            text: "baz",
            type: "string",
            items: [],
        });
        expect(navigation[0]["[1][1]"]).toMatchObject({
            self: "[1][1]",
            parent: "[1]",
            relativeDataLocation: "[1][1]",
            schemaLocation: "items.items",
            schema: schema.items.items,
            disabled: false,
            data: "WorldB",
            text: "baz",
            type: "string",
            items: [],
        });
    });
    test("should get a navigation object from a schema with a nested array", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.object,
            properties: {
                foo: {
                    type: DataType.array,
                    items: {
                        title: "bat",
                        type: DataType.string,
                    },
                },
            },
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            { foo: ["hello", "world"] }
        );

        expect(Object.keys(navigation[0])).toHaveLength(4);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            parentDictionaryItem: undefined,
            data: { foo: ["hello", "world"] },
            relativeDataLocation: "",
            schemaLocation: "",
            schema,
            disabled: false,
            text: "bar",
            type: DataType.object,
            items: ["foo"],
        });
        expect(navigation[0]["foo"]).toMatchObject({
            self: "foo",
            parent: "",
            parentDictionaryItem: undefined,
            data: ["hello", "world"],
            relativeDataLocation: "foo",
            schemaLocation: "properties.foo",
            schema: schema.properties.foo,
            disabled: false,
            text: undefined,
            type: DataType.array,
            items: ["foo[0]", "foo[1]"],
        });
        expect(navigation[0]["foo[0]"]).toMatchObject({
            self: "foo[0]",
            parent: "foo",
            parentDictionaryItem: undefined,
            data: "hello",
            relativeDataLocation: "foo[0]",
            schemaLocation: "properties.foo.items",
            schema: schema.properties.foo.items,
            disabled: false,
            text: "bat",
            type: DataType.string,
            items: [],
        });
        expect(navigation[0]["foo[1]"]).toMatchObject({
            self: "foo[1]",
            parent: "foo",
            parentDictionaryItem: undefined,
            data: "world",
            relativeDataLocation: "foo[1]",
            schemaLocation: "properties.foo.items",
            schema: schema.properties.foo.items,
            disabled: false,
            text: "bat",
            type: DataType.string,
            items: [],
        });
    });
    test("should get a navigation object from a schema with type array and data containing properties", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.array,
            items: {
                title: "bat",
                type: DataType.object,
                properties: {
                    hello: {
                        title: "Hello world",
                        type: DataType.string,
                    },
                },
            },
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            [
                {
                    hello: "world",
                },
            ]
        );

        expect(Object.keys(navigation[0])).toHaveLength(3);
        expect(navigation[0]["[0].hello"].data).toEqual("world");
        expect(navigation[0]["[0].hello"].schemaLocation).toEqual(
            "items.properties.hello"
        );
        expect(navigation[0]["[0].hello"].schema).toMatchObject({
            title: "Hello world",
            type: DataType.string,
        });
        expect(navigation[0]["[0].hello"].text).toEqual("Hello world");
    });
    test("should get a navigation object from a schema with a oneOf keyword", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            oneOf: [
                {
                    title: "string",
                    type: DataType.string,
                },
                {
                    title: "number",
                    type: DataType.number,
                },
            ],
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            42
        );

        expect(Object.keys(navigation[0])).toHaveLength(3);
        expect(navigation[0]["{oneOf[0]}"].schemaLocation).toEqual("oneOf[0]");
        expect(navigation[0]["{oneOf[0]}"].schema).toMatchObject(schema.oneOf[0]);
        expect(navigation[0]["{oneOf[0]}"].data).toEqual(42);
        expect(navigation[0]["{oneOf[1]}"].schemaLocation).toEqual("oneOf[1]");
        expect(navigation[0]["{oneOf[1]}"].schema).toMatchObject(schema.oneOf[1]);
        expect(navigation[0]["{oneOf[1]}"].data).toEqual(42);
    });
    test("should get a navigation object from a schema with a oneOf keyword with no data defined", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            oneOf: [
                {
                    title: "string",
                    type: DataType.string,
                },
                {
                    title: "number",
                    type: DataType.number,
                },
            ],
        };
        const navigation = getNavigation(schema, schema.$id, { [schema.$id]: schema });

        expect(Object.keys(navigation[0])).toHaveLength(3);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            parentDictionaryItem: undefined,
            data: undefined,
            relativeDataLocation: "",
            schemaLocation: "",
            schema,
            disabled: false,
            text: "bar",
            type: DataType.unknown,
            items: ["{oneOf[0]}", "{oneOf[1]}"],
        });
        expect(navigation[0]["{oneOf[0]}"]).toMatchObject({
            self: "{oneOf[0]}",
            parent: "",
            parentDictionaryItem: undefined,
            data: undefined,
            relativeDataLocation: "",
            schemaLocation: "oneOf[0]",
            schema: schema.oneOf[0],
            disabled: false,
            text: "string",
            type: DataType.string,
            items: [],
        });
        expect(navigation[0]["{oneOf[1]}"]).toMatchObject({
            self: "{oneOf[1]}",
            parent: "",
            parentDictionaryItem: undefined,
            data: undefined,
            relativeDataLocation: "",
            schemaLocation: "oneOf[1]",
            schema: schema.oneOf[1],
            disabled: false,
            text: "number",
            type: DataType.number,
            items: [],
        });
    });
    test("should get a navigation object from a schema with nested oneOf keywords", () => {
        const schema: any = {
            $id: "foo",
            title: "bar",
            oneOf: [
                {
                    oneOf: [
                        {
                            title: "string",
                            type: DataType.string,
                        },
                        {
                            title: "boolean",
                            type: DataType.boolean,
                        },
                    ],
                },
                {
                    title: "number",
                    type: DataType.number,
                },
            ],
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            { [schema.$id]: schema },
            "foo"
        );

        expect(Object.keys(navigation[0])).toHaveLength(5);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            parentDictionaryItem: void 0,
            data: "foo",
            relativeDataLocation: "",
            schemaLocation: "",
            schema,
            disabled: false,
            text: "bar",
            type: DataType.unknown,
            items: ["{oneOf[0]}", "{oneOf[1]}"],
        });
        expect(navigation[0]["{oneOf[0]}"]).toMatchObject({
            self: "{oneOf[0]}",
            parent: "",
            parentDictionaryItem: void 0,
            data: "foo",
            relativeDataLocation: "",
            schemaLocation: "oneOf[0]",
            schema: schema.oneOf[0],
            disabled: false,
            text: undefined,
            type: DataType.unknown,
            items: ["{oneOf[0].oneOf[0]}", "{oneOf[0].oneOf[1]}"],
        });
        expect(navigation[0]["{oneOf[0].oneOf[0]}"]).toMatchObject({
            self: "{oneOf[0].oneOf[0]}",
            parent: "{oneOf[0]}",
            parentDictionaryItem: void 0,
            data: "foo",
            relativeDataLocation: "",
            schemaLocation: "oneOf[0].oneOf[0]",
            schema: schema.oneOf[0].oneOf[0],
            disabled: false,
            text: "string",
            type: DataType.string,
            items: [],
        });
        expect(navigation[0]["{oneOf[0].oneOf[1]}"]).toMatchObject({
            self: "{oneOf[0].oneOf[1]}",
            parent: "{oneOf[0]}",
            parentDictionaryItem: void 0,
            data: "foo",
            relativeDataLocation: "",
            schemaLocation: "oneOf[0].oneOf[1]",
            schema: schema.oneOf[0].oneOf[1],
            disabled: false,
            text: "boolean",
            type: DataType.boolean,
            items: [],
        });
        expect(navigation[0]["{oneOf[1]}"]).toMatchObject({
            self: "{oneOf[1]}",
            parent: "",
            parentDictionaryItem: void 0,
            data: "foo",
            relativeDataLocation: "",
            schemaLocation: "oneOf[1]",
            schema: schema.oneOf[1],
            disabled: false,
            text: "number",
            type: DataType.number,
            items: [],
        });
    });
    test("should get a navigation object from a schema with a anyOf keyword", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            anyOf: [
                {
                    title: "string",
                    type: DataType.string,
                },
                {
                    title: "number",
                    type: DataType.number,
                },
            ],
        };
        expect(
            getNavigation(
                schema,
                schema.$id,
                {
                    [schema.$id]: schema,
                },
                42
            )
        ).toMatchObject([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    text: "bar",
                    type: DataType.unknown,
                    items: ["{anyOf[0]}", "{anyOf[1]}"],
                },
                "{anyOf[0]}": {
                    self: "{anyOf[0]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "anyOf[0]",
                    schema: schema.anyOf[0],
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "{anyOf[1]}": {
                    self: "{anyOf[1]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "anyOf[1]",
                    schema: schema.anyOf[1],
                    disabled: false,
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with a nested oneOf keyword", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: "object",
            properties: {
                foo: {
                    oneOf: [
                        {
                            title: "string",
                            type: DataType.string,
                        },
                        {
                            title: "number",
                            type: DataType.number,
                        },
                    ],
                },
            },
        };
        expect(
            getNavigation(
                schema,
                schema.$id,
                {
                    [schema.$id]: schema,
                },
                {
                    foo: 42,
                }
            )
        ).toMatchObject([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: void 0,
                    data: {
                        foo: 42,
                    },
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    text: "bar",
                    type: DataType.object,
                    items: ["foo"],
                },
                foo: {
                    self: "foo",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo",
                    schema: schema.properties.foo,
                    disabled: false,
                    text: void 0,
                    type: DataType.unknown,
                    items: [
                        "foo{properties.foo.oneOf[0]}",
                        "foo{properties.foo.oneOf[1]}",
                    ],
                },
                "foo{properties.foo.oneOf[0]}": {
                    self: "foo{properties.foo.oneOf[0]}",
                    parent: "foo",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo.oneOf[0]",
                    schema: schema.properties.foo.oneOf[0],
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "foo{properties.foo.oneOf[1]}": {
                    self: "foo{properties.foo.oneOf[1]}",
                    parent: "foo",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo.oneOf[1]",
                    schema: schema.properties.foo.oneOf[1],
                    disabled: false,
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with a $ref", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            type: DataType.object,
            properties: {
                bat: {
                    $ref: "#/$defs/baz",
                },
            },
            $defs: {
                baz: {
                    title: "baz",
                    type: DataType.string,
                },
            },
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(navigation[0][navigation[1]].type).toEqual(DataType.object);
        expect(navigation[0][navigation[1]].schema).toMatchObject(schema);
        expect(navigation[0]["bat"].type).toEqual(DataType.string);
        expect(navigation[0]["bat"].schema).toMatchObject(schema.$defs.baz);
    });
    test("should get a navigation object from a schema with a $ref, array, and oneOf", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            oneOf: [
                {
                    type: DataType.object,
                    properties: {
                        bat: {
                            $ref: "#/$defs/baz",
                        },
                    },
                },
            ],
            $defs: {
                baz: {
                    oneOf: [
                        {
                            title: "bat",
                            type: DataType.array,
                            items: {
                                $ref: "#/$defs/baz",
                            },
                        },
                        {
                            title: "baz",
                            type: DataType.string,
                        },
                    ],
                },
            },
        };
        const navigation = getNavigation(schema, schema.$id, {
            [schema.$id]: schema,
        });

        expect(navigation).toMatchObject([
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    text: "bar",
                    type: "unknown",
                    items: ["{oneOf[0]}"],
                },
                "{oneOf[0]}": {
                    self: "{oneOf[0]}",
                    parent: "",
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[0]",
                    schema: schema.oneOf[0],
                },
                bat: {
                    self: "bat",
                    parent: "{oneOf[0]}",
                    relativeDataLocation: "bat",
                    schemaLocation: "$defs.baz",
                    schema: schema.$defs.baz,
                    disabled: false,
                    type: "unknown",
                    items: ["bat{$defs.baz.oneOf[0]}", "bat{$defs.baz.oneOf[1]}"],
                },
                "bat{$defs.baz.oneOf[0]}": {
                    self: "bat{$defs.baz.oneOf[0]}",
                    parent: "bat",
                    schemaLocation: "$defs.baz.oneOf[0]",
                    schema: schema.$defs.baz.oneOf[0],
                    disabled: false,
                    text: "bat",
                    type: "array",
                    items: [],
                },
                "bat{$defs.baz.oneOf[1]}": {
                    self: "bat{$defs.baz.oneOf[1]}",
                    parent: "bat",
                    relativeDataLocation: "bat",
                    schemaLocation: "$defs.baz.oneOf[1]",
                    schema: schema.$defs.baz.oneOf[1],
                    disabled: false,
                    text: "baz",
                    type: "string",
                    items: [],
                },
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with a $ref, array, and oneOf with data", () => {
        const schema = {
            $id: "foo",
            title: "bar",
            oneOf: [
                {
                    $ref: "#/$defs/bat",
                },
            ],
            $defs: {
                baz: {
                    title: "baz",
                    oneOf: [
                        {
                            title: "baz array",
                            type: DataType.array,
                            items: {
                                $ref: "#/$defs/bat",
                            },
                        },
                        {
                            title: "baz string",
                            type: DataType.string,
                        },
                    ],
                },
                bat: {
                    title: "bat",
                    type: DataType.object,
                    properties: {
                        bat: {
                            $ref: "#/$defs/baz",
                        },
                    },
                },
            },
        };
        const data = {
            bat: [
                {
                    bat: [
                        {
                            bat: [
                                {
                                    bat: "foo",
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const navigation = getNavigation(
            schema,
            schema.$id,
            {
                [schema.$id]: schema,
            },
            data
        );

        expect(Object.keys(navigation[0])).toHaveLength(17);
        expect(navigation[0][""]).toMatchObject({
            self: "",
            parent: null,
            relativeDataLocation: "",
            schemaLocation: "$defs.bat",
            schema: schema.$defs.bat,
            disabled: false,
            text: "bat",
            type: "object",
            items: ["bat"],
        });
        expect(navigation[0]["bat"]).toMatchObject({
            self: "bat",
            parent: "",
            relativeDataLocation: "bat",
            schemaLocation: "$defs.baz",
            schema: schema.$defs.baz,
            disabled: false,
            text: "baz",
            type: "unknown",
            items: ["bat{$defs.baz.oneOf[0]}", "bat{$defs.baz.oneOf[1]}"],
        });
        expect(navigation[0]["bat{$defs.baz.oneOf[0]}"]).toMatchObject({
            self: "bat{$defs.baz.oneOf[0]}",
            parent: "bat",
            relativeDataLocation: "bat",
            schemaLocation: "$defs.baz.oneOf[0]",
            schema: schema.$defs.baz.oneOf[0],
            disabled: false,
            type: "array",
            items: ["bat[0]"],
        });
        expect(navigation[0]["bat{$defs.baz.oneOf[1]}"]).toMatchObject({
            self: "bat{$defs.baz.oneOf[1]}",
            parent: "bat",
            schemaLocation: "$defs.baz.oneOf[1]",
            schema: schema.$defs.baz.oneOf[1],
            disabled: false,
            text: "baz string",
            type: "string",
            items: [],
        });
        expect(navigation[0]["bat[0]"]).toMatchObject({
            self: "bat[0]",
            parent: "bat{$defs.baz.oneOf[0]}",
            relativeDataLocation: "bat[0]",
            schemaLocation: "$defs.bat",
            schema: schema.$defs.bat,
            disabled: false,
            text: "bat",
            type: "object",
            items: ["bat[0].bat"],
        });
        expect(navigation[0]["bat[0].bat"]).toMatchObject({
            self: "bat[0].bat",
            parent: "bat[0]",
            relativeDataLocation: "bat[0].bat",
            schemaLocation: "$defs.baz",
            schema: schema.$defs.baz,
            disabled: false,
            text: "baz",
            type: "unknown",
            items: ["bat[0].bat{$defs.baz.oneOf[0]}", "bat[0].bat{$defs.baz.oneOf[1]}"],
        });
        expect(navigation[0]["bat[0].bat{$defs.baz.oneOf[0]}"]).toMatchObject({
            self: "bat[0].bat{$defs.baz.oneOf[0]}",
            parent: "bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[0]",
            schema: schema.$defs.baz.oneOf[0],
            disabled: false,
            data: data.bat[0].bat,
            text: "baz array",
            type: "array",
            items: ["bat[0].bat[0]"],
        });
        expect(navigation[0]["bat[0].bat{$defs.baz.oneOf[1]}"]).toMatchObject({
            self: "bat[0].bat{$defs.baz.oneOf[1]}",
            parent: "bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[1]",
            schema: schema.$defs.baz.oneOf[1],
            disabled: false,
            data: data.bat[0].bat,
            text: "baz string",
            type: "string",
            items: [],
        });
        expect(navigation[0]["bat[0].bat[0]"]).toMatchObject({
            self: "bat[0].bat[0]",
            parent: "bat[0].bat{$defs.baz.oneOf[0]}",
            relativeDataLocation: "bat[0].bat[0]",
            schemaLocation: "$defs.bat",
            schema: schema.$defs.bat,
            disabled: false,
            text: "bat",
            type: "object",
            items: ["bat[0].bat[0].bat"],
        });
        expect(navigation[0]["bat[0].bat[0].bat"]).toMatchObject({
            self: "bat[0].bat[0].bat",
            parent: "bat[0].bat[0]",
            relativeDataLocation: "bat[0].bat[0].bat",
            schemaLocation: "$defs.baz",
            schema: schema.$defs.baz,
            disabled: false,
            text: "baz",
            type: "unknown",
            items: [
                "bat[0].bat[0].bat{$defs.baz.oneOf[0]}",
                "bat[0].bat[0].bat{$defs.baz.oneOf[1]}",
            ],
        });
        expect(navigation[0]["bat[0].bat[0].bat{$defs.baz.oneOf[0]}"]).toMatchObject({
            self: "bat[0].bat[0].bat{$defs.baz.oneOf[0]}",
            parent: "bat[0].bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[0]",
            schema: schema.$defs.baz.oneOf[0],
            disabled: false,
            data: data.bat[0].bat[0].bat,
            text: "baz array",
            type: "array",
            items: ["bat[0].bat[0].bat[0]"],
        });
        expect(navigation[0]["bat[0].bat[0].bat{$defs.baz.oneOf[1]}"]).toMatchObject({
            self: "bat[0].bat[0].bat{$defs.baz.oneOf[1]}",
            parent: "bat[0].bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[1]",
            schema: schema.$defs.baz.oneOf[1],
            disabled: false,
            data: data.bat[0].bat[0].bat,
            text: "baz string",
            type: "string",
            items: [],
        });
        expect(navigation[0]["bat[0].bat[0].bat[0]"]).toMatchObject({
            self: "bat[0].bat[0].bat[0]",
            parent: "bat[0].bat[0].bat{$defs.baz.oneOf[0]}",
            relativeDataLocation: "bat[0].bat[0].bat[0]",
            schemaLocation: "$defs.bat",
            schema: schema.$defs.bat,
            disabled: false,
            text: "bat",
            type: "object",
            items: ["bat[0].bat[0].bat[0].bat"],
        });
        expect(navigation[0]["bat[0].bat[0].bat[0].bat"]).toMatchObject({
            self: "bat[0].bat[0].bat[0].bat",
            parent: "bat[0].bat[0].bat[0]",
            relativeDataLocation: "bat[0].bat[0].bat[0].bat",
            schemaLocation: "$defs.baz",
            schema: schema.$defs.baz,
            disabled: false,
            text: "baz",
            type: "unknown",
            items: [
                "bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[0]}",
                "bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[1]}",
            ],
        });
        expect(
            navigation[0]["bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[0]}"]
        ).toMatchObject({
            self: "bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[0]}",
            parent: "bat[0].bat[0].bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat[0].bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[0]",
            schema: schema.$defs.baz.oneOf[0],
            disabled: false,
            data: data.bat[0].bat[0].bat[0].bat,
            text: "baz array",
            type: "array",
            items: [],
        });
        expect(
            navigation[0]["bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[1]}"]
        ).toMatchObject({
            self: "bat[0].bat[0].bat[0].bat{$defs.baz.oneOf[1]}",
            parent: "bat[0].bat[0].bat[0].bat",
            parentDictionaryItem: undefined,
            relativeDataLocation: "bat[0].bat[0].bat[0].bat",
            schemaLocation: "$defs.baz.oneOf[1]",
            schema: schema.$defs.baz.oneOf[1],
            disabled: false,
            data: data.bat[0].bat[0].bat[0].bat,
            text: "baz string",
            type: "string",
            items: [],
        });
    });
});

test.describe("getNavigationDictionary", () => {
    test("should not throw", () => {
        expect(() =>
            getNavigationDictionary(
                {
                    foo: { id: "foo" },
                },
                [
                    {
                        "": {
                            schemaId: "foo",
                            data: void 0,
                        },
                    },
                    "",
                ]
            )
        ).not.toThrow();
    });
    test("should return a dictionary with a single navigation config", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
            {
                foo: { id: "foo" },
            },
            [
                {
                    "": {
                        schemaId: "foo",
                        data: void 0,
                    },
                },
                "",
            ]
        );
        const navigationId: string = navigation[1];

        expect(typeof navigationId).toEqual("string");
        expect(Object.keys(navigation[0])).toMatchObject([navigationId]);
    });
    test("should return a dictionary with multiple navigation configs", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
            {
                baz: {
                    id: "baz",
                    type: "object",
                    properties: {
                        foo: {
                            [dictionaryLink]: "foo",
                        },
                    },
                },
                bat: {
                    id: "bat",
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
            [
                {
                    abc: {
                        schemaId: "baz",
                        data: {
                            foo: [
                                {
                                    id: "def",
                                },
                            ],
                        },
                    },
                    def: {
                        schemaId: "bat",
                        parent: {
                            id: "abc",
                            dataLocation: "foo",
                        },
                        data: {
                            bar: "hello world",
                        },
                    },
                },
                "abc",
            ]
        );

        expect(Object.keys(navigation[0])).toHaveLength(2);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem
        ).not.toEqual(undefined);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.id
        ).toEqual("abc");
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.dataLocation
        ).toEqual("foo");
    });
    test("should use text from a data location if displayTextDataLocation has been specified", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
            {
                baz: {
                    id: "baz",
                    type: "object",
                    properties: {
                        foo: {
                            [dictionaryLink]: "foo",
                        },
                    },
                },
                bat: {
                    id: "bat",
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
            [
                {
                    abc: {
                        schemaId: "baz",
                        data: {
                            foo: [
                                {
                                    id: "def",
                                },
                            ],
                            displayText: "test1",
                        },
                    },
                    def: {
                        schemaId: "bat",
                        parent: {
                            id: "abc",
                            dataLocation: "foo",
                        },
                        data: {
                            bar: "hello world",
                            displayText: "test2",
                        },
                    },
                },
                "abc",
            ],
            "displayText"
        );

        expect(navigation[0]["abc"][0][""].text).toEqual("test1");
        expect(navigation[0]["def"][0][""].text).toEqual("test2");
    });
});
