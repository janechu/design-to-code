import { expect, test } from "../__test__/base-fixtures.js";
import mdnData from "mdn-data";
const { css: mdnCSS } = mdnData;
import {
    CombinatorType,
    mapCombinatorType,
    mapCSSGroups,
    mapCSSInlineStyleToCSSPropertyDictionary,
    mapCSSProperties,
    mapCSSSyntaxes,
    mapMixedCombinatorTypes,
    mapMultiplierType,
    mapStringLiterals,
    MultiplierType,
    resolveCSSGroups,
    resolveCSSPropertySyntax,
    resolveCSSPropertySyntaxSplit,
    resolveCSSSyntax,
    resolveReferenceType,
} from "./mapping.mdn-data.js";

test.describe("mapStringLiterals,", () => {
    test("should keep track of '/' and ',' as literals", () => {
        expect(mapStringLiterals("/ <length-percentage>")).toEqual("/");
        expect(mapStringLiterals("<length-percentage>")).toEqual(null);
        expect(mapStringLiterals(", <length-percentage>")).toEqual(",");
    });
});

test.describe("mapCSSGroups", () => {
    test("should map a single group", () => {
        expect(mapCSSGroups("foo [ bar ]+ baz")).toMatchObject([
            {
                id: "uuid4",
                range: [4, 11],
                multiplier: {
                    type: MultiplierType.oneOrMore,
                },
                syntax: "[ bar ]+",
                normalizedSyntax: "bar",
            },
        ]);
    });
    test("should map multiple groups", () => {
        expect(mapCSSGroups("foo [ bar ]! baz [ quux ]")).toMatchObject([
            {
                id: "uuid4",
                range: [4, 11],
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
                syntax: "[ bar ]!",
                normalizedSyntax: "bar",
            },
            {
                id: "uuid17",
                range: [17, 24],
                multiplier: null,
                syntax: "[ quux ]",
                normalizedSyntax: "quux",
            },
        ]);
    });
    test("should map a single nesting group", () => {
        expect(mapCSSGroups("foo [ bar [ bat ]? ]* baz")).toMatchObject([
            {
                id: "uuid4",
                range: [4, 20],
                multiplier: {
                    type: MultiplierType.zeroOrMore,
                },
                syntax: "[ bar [ bat ]? ]*",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 17],
                        multiplier: {
                            type: MultiplierType.zeroOrOne,
                        },
                        syntax: "[ bat ]?",
                        normalizedSyntax: "bat",
                    },
                ],
            },
        ]);
    });
    test("should map multiple nestings groups with multipliers", () => {
        expect(mapCSSGroups("foo [ bar [ bat [ baz ]{1,2} ]+ ]! quux")).toMatchObject([
            {
                id: "uuid4",
                range: [4, 33],
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
                syntax: "[ bar [ bat [ baz ]{1,2} ]+ ]!",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 30],
                        multiplier: {
                            type: MultiplierType.oneOrMore,
                        },
                        syntax: "[ bat [ baz ]{1,2} ]+",
                        normalizedSyntax: "bat uuid16",
                        contains: [
                            {
                                id: "uuid16",
                                range: [16, 27],
                                multiplier: {
                                    type: MultiplierType.atLeastATimesAtMostBTimes,
                                    range: [1, 2],
                                },
                                syntax: "[ baz ]{1,2}",
                                normalizedSyntax: "baz",
                            },
                        ],
                    },
                ],
            },
        ]);
    });
    test("should map multiple groups with nesting", () => {
        expect(mapCSSGroups("foo [ bar [ bat ] ] baz [ quux ]")).toMatchObject([
            {
                id: "uuid4",
                range: [4, 18],
                multiplier: null,
                syntax: "[ bar [ bat ] ]",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 16],
                        multiplier: null,
                        syntax: "[ bat ]",
                        normalizedSyntax: "bat",
                    },
                ],
            },
            {
                id: "uuid24",
                range: [24, 31],
                multiplier: null,
                syntax: "[ quux ]",
                normalizedSyntax: "quux",
            },
        ]);
    });
    test("should map groups with multipliers", () => {
        expect(
            mapCSSGroups(
                "foo [ bar ]# baz [ quux ]{1,4} bat [ fuzz ]? [ fazz ]* [ buzz ]! [ corge ]+ [ quz ]{1,6}"
            )
        ).toMatchObject([
            {
                id: "uuid4",
                range: [4, 11],
                syntax: "[ bar ]#",
                normalizedSyntax: "bar",
                multiplier: {
                    type: MultiplierType.oneOrMoreSeparatedByComma,
                },
            },
            {
                id: "uuid17",
                range: [17, 29],
                syntax: "[ quux ]{1,4}",
                normalizedSyntax: "quux",
                multiplier: {
                    type: MultiplierType.atLeastATimesAtMostBTimes,
                    range: [1, 4],
                },
            },
            {
                id: "uuid35",
                range: [35, 43],
                syntax: "[ fuzz ]?",
                normalizedSyntax: "fuzz",
                multiplier: {
                    type: MultiplierType.zeroOrOne,
                },
            },
            {
                id: "uuid45",
                range: [45, 53],
                syntax: "[ fazz ]*",
                normalizedSyntax: "fazz",
                multiplier: {
                    type: MultiplierType.zeroOrMore,
                },
            },
            {
                id: "uuid55",
                range: [55, 63],
                syntax: "[ buzz ]!",
                normalizedSyntax: "buzz",
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
            },
            {
                id: "uuid65",
                range: [65, 74],
                syntax: "[ corge ]+",
                normalizedSyntax: "corge",
                multiplier: {
                    type: MultiplierType.oneOrMore,
                },
            },
            {
                id: "uuid76",
                range: [76, 87],
                syntax: "[ quz ]{1,6}",
                normalizedSyntax: "quz",
                multiplier: {
                    type: MultiplierType.atLeastATimesAtMostBTimes,
                    range: [1, 6],
                },
            },
        ]);
    });
});

test.describe("mapMultiplierType", () => {
    test("should find a zero or more multiplier type", () => {
        expect(mapMultiplierType("foo*")).toMatchObject({
            type: MultiplierType.zeroOrMore,
        });
    });
    test("should find a one or more multiplier type", () => {
        expect(mapMultiplierType("foo+")).toMatchObject({
            type: MultiplierType.oneOrMore,
        });
    });
    test("should find a zero or one multiplier type", () => {
        expect(mapMultiplierType("foo?")).toMatchObject({
            type: MultiplierType.zeroOrOne,
        });
    });
    test("should find an at least A times at most B times multiplier type", () => {
        expect(mapMultiplierType("foo{1,3}")).toMatchObject({
            type: MultiplierType.atLeastATimesAtMostBTimes,
            range: [1, 3],
        });
    });
    test("should find a one ore more separated by comma multiplier type", () => {
        expect(mapMultiplierType("foo#")).toMatchObject({
            type: MultiplierType.oneOrMoreSeparatedByComma,
        });
    });
    test("should find an  at least one value multiplier type", () => {
        expect(mapMultiplierType("foo!")).toMatchObject({
            type: MultiplierType.atLeastOne,
        });
    });
});

test.describe("mapCombinatorType", () => {
    test("should find a juxtaposition combination type", () => {
        expect(mapCombinatorType("foo bar bat")).toEqual(CombinatorType.juxtaposition);
        expect(
            mapCombinatorType("/ <length-percentage>! [ / <length-percentage>{1,4} ]?")
        ).toEqual(CombinatorType.juxtaposition);
        expect(
            mapCombinatorType("<'mask-border-width'>? [ / <'mask-border-outset'> ]")
        ).toEqual(CombinatorType.juxtaposition);
    });
    test("should find mandatory items in any order combination type", () => {
        expect(mapCombinatorType("foo && bar && bat")).toEqual(
            CombinatorType.mandatoryInAnyOrder
        );
    });
    test("should find at least one in any order combination type", () => {
        expect(mapCombinatorType("foo || bar || bat")).toEqual(
            CombinatorType.atLeastOneInAnyOrder
        );
    });
    test("should find exactly one combination type", () => {
        expect(mapCombinatorType("foo | bar | bat")).toEqual(CombinatorType.exactlyOne);
        expect(mapCombinatorType("[ <custom-ident> <integer>? ]+ | none")).toEqual(
            CombinatorType.exactlyOne
        );
    });
    test("should find group combination type", () => {
        expect(mapCombinatorType("[foo bar bat]{1,4}")).toEqual(CombinatorType.brackets);
    });
    test("should find none if no combination types are found", () => {
        expect(mapCombinatorType("foo")).toEqual(CombinatorType.none);
    });
});

test.describe("resolveReferenceType", () => {
    test("should resolve a reference of type syntax", () => {
        expect(
            resolveReferenceType("<line-style>", CombinatorType.none, ["line-style"], [])
        ).toEqual("syntax");
    });
    test("should resolve a reference of type types", () => {
        expect(
            resolveReferenceType("<length>", CombinatorType.none, [], ["length"])
        ).toEqual("type");
    });
    test("should resolve a reference of type property", () => {
        expect(
            resolveReferenceType("<'margin-left'>", CombinatorType.none, [], [])
        ).toEqual("property");
    });
    test("should resolve a reference of type value", () => {
        expect(resolveReferenceType("<line-style>", CombinatorType.none, [], [])).toEqual(
            "value"
        );
        expect(resolveReferenceType("<length>", CombinatorType.none, [], [])).toEqual(
            "value"
        );
        expect(resolveReferenceType("auto", CombinatorType.none, [], [])).toEqual(
            "value"
        );
    });
});

test.describe("resolveCSSPropertySyntaxSplit", () => {
    test("should split by at least one in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit(
                "foo || bar",
                CombinatorType.atLeastOneInAnyOrder
            )
        ).toMatchObject(["foo", "bar"]);
    });
    test("should split by exactly one", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo | bar", CombinatorType.juxtaposition)
        ).toMatchObject(["foo", "bar"]);
        expect(
            resolveCSSPropertySyntaxSplit(
                "[ <custom-ident> <integer>? ]+ | none",
                CombinatorType.juxtaposition
            )
        ).toMatchObject(["[ <custom-ident> <integer>? ]+", "none"]);
    });
    test("should split by juxtaposition", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo bar", CombinatorType.juxtaposition)
        ).toMatchObject(["foo", "bar"]);
    });
    test("should split by mandatory in any order juxtaposed", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo && bar", CombinatorType.juxtaposition)
        ).toMatchObject(["foo", "bar"]);
    });
    test("should split by mandatory in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foobar", CombinatorType.none)
        ).toMatchObject(["foobar"]);
    });
});

test.describe("resolveCSSGroups", () => {
    test("should resolve a simple string referece", () => {
        expect(resolveCSSGroups("<length>", [], [])).toMatchObject([
            {
                multiplier: null,
                prepend: null,
                ref: "<length>",
                refCombinatorType: CombinatorType.none,
                type: "value",
            },
        ]);
    });
    test("should resolve a reference with multipliers and prepended string literals", () => {
        expect(resolveCSSGroups("/ <length>?", [], ["length"])).toMatchObject([
            {
                multiplier: {
                    type: MultiplierType.zeroOrOne,
                },
                prepend: "/",
                ref: "<length>",
                refCombinatorType: CombinatorType.none,
                type: "type",
            },
        ]);
    });
    test("should resolve a nested reference", () => {
        resolveCSSGroups(
            "<color>{1,4} [ / <length-percentage>{1,4} ]?",
            [],
            ["color", "length-percentage"]
        );
        expect(
            resolveCSSGroups(
                "<color>{1,4} [ / <length-percentage>{1,4} ]?",
                [],
                ["color", "length-percentage"]
            )
        ).toMatchObject([
            {
                multiplier: {
                    range: [1, 4],
                    type: "atLeastATimesAtMostBTimes",
                },
                prepend: null,
                ref: "<color>",
                refCombinatorType: "none",
                type: "type",
            },
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: null,
                ref: [
                    {
                        multiplier: {
                            range: [1, 4],
                            type: "atLeastATimesAtMostBTimes",
                        },
                        prepend: "/",
                        ref: "<length-percentage>",
                        refCombinatorType: "none",
                        type: "type",
                    },
                ],
                refCombinatorType: "none",
                type: "group",
            },
        ]);

        expect(
            resolveCSSGroups(
                "[ / <'mask-border-width'>! [ / <'mask-border-outset'> ]? ]?",
                [],
                []
            )
        ).toMatchObject([
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: null,
                ref: [
                    {
                        multiplier: {
                            type: "atLeastOne",
                        },
                        prepend: "/",
                        ref: "<'mask-border-width'>",
                        refCombinatorType: "none",
                        type: "property",
                    },
                    {
                        multiplier: {
                            type: "zeroOrOne",
                        },
                        prepend: null,
                        ref: [
                            {
                                multiplier: null,
                                prepend: "/",
                                ref: "<'mask-border-outset'>",
                                refCombinatorType: "none",
                                type: "property",
                            },
                        ],
                        refCombinatorType: "none",
                        type: "group",
                    },
                ],
                refCombinatorType: "juxtaposition",
                type: "group",
            },
        ]);
    });
});

test.describe("resolveCSSPropertySyntax", () => {
    test("should resolve a CSS properties syntax without shorthand properties", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "<color>",
                    initial: "transparent",
                    percentages: "no",
                } as any,
                "background-color",
                [],
                ["color"]
            )
        ).toMatchObject({
            mapsToProperty: "background-color",
            percentages: "no",
            ref: "<color>",
            multiplier: null,
            prepend: null,
            type: "type",
            refCombinatorType: CombinatorType.none,
        });
    });
    test("should resolve a CSS properties syntax with shorthand properties", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "[ <length> | <percentage> ]{1,4}",
                    initial: [
                        "padding-bottom",
                        "padding-left",
                        "padding-right",
                        "padding-top",
                    ],
                    percentages: "referToWidthOfContainingBlock",
                } as any,
                "padding",
                [],
                ["length", "percentage"]
            )
        ).toMatchObject({
            mapsToProperty: "padding",
            percentages: "referToWidthOfContainingBlock",
            refCombinatorType: CombinatorType.exactlyOne,
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "<length>",
                    refCombinatorType: CombinatorType.none,
                    type: "type",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "<percentage>",
                    refCombinatorType: CombinatorType.none,
                    type: "type",
                },
            ],
            multiplier: {
                type: MultiplierType.atLeastATimesAtMostBTimes,
                range: [1, 4],
            },
            type: "group",
            prepend: null,
        });
    });
    test("should resolve a CSS properties syntax with a single syntax", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "<foo>#",
                    percentages: "referToWidthOfContainingBlock",
                } as any,
                "bar",
                [],
                ["foo"]
            )
        ).toMatchObject({
            mapsToProperty: "bar",
            multiplier: {
                type: "oneOrMoreSeparatedByComma",
            },
            percentages: "referToWidthOfContainingBlock",
            prepend: null,
            ref: "<foo>",
            refCombinatorType: "none",
            type: "type",
        });
    });
});

test.describe("mapCSSProperties", () => {
    test("should return a subset of MDN data into a subset of CSS properties ", () => {
        const subsetOfMDNCSS = {
            properties: {
                border: mdnCSS.properties.border,
            },
            syntaxes: mdnCSS.syntaxes,
            types: mdnCSS.types,
        } as any;

        expect(mapCSSProperties(subsetOfMDNCSS)).toMatchObject({
            border: {
                name: "border",
                appliesTo: "allElements",
                syntax: {
                    mapsToProperty: "border",
                    percentages: "no",
                    ref: [
                        {
                            type: "syntax",
                            ref: "<line-width>",
                            refCombinatorType: "none",
                            prepend: null,
                            multiplier: null,
                        },
                        {
                            type: "syntax",
                            ref: "<line-style>",
                            refCombinatorType: "none",
                            prepend: null,
                            multiplier: null,
                        },
                        {
                            type: "syntax",
                            ref: "<color>",
                            refCombinatorType: "none",
                            prepend: null,
                            multiplier: null,
                        },
                    ],
                    refCombinatorType: "atLeastOneInAnyOrder",
                    multiplier: null,
                    prepend: null,
                    type: "mixed",
                },
            },
        });
    });
    test.describe("options", () => {
        test("should check for status", () => {
            const subsetOfMDNCSS = {
                properties: {
                    "--*": mdnCSS.properties["--*"],
                    border: mdnCSS.properties.border,
                },
                syntaxes: mdnCSS.syntaxes,
                types: mdnCSS.types,
            } as any;

            expect(
                mapCSSProperties(subsetOfMDNCSS, { status: "standard" })
            ).toMatchObject({
                border: {
                    name: "border",
                    appliesTo: "allElements",
                    syntax: {
                        mapsToProperty: "border",
                        percentages: "no",
                        ref: [
                            {
                                type: "syntax",
                                ref: "<line-width>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                            {
                                type: "syntax",
                                ref: "<line-style>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                            {
                                type: "syntax",
                                ref: "<color>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                        ],
                        refCombinatorType: "atLeastOneInAnyOrder",
                        multiplier: null,
                        prepend: null,
                        type: "mixed",
                    },
                },
            });
        });
    });
});

test.describe("resolveCSSSyntax", () => {
    test("should resolve a CSS syntax without grouped items", () => {
        expect(resolveCSSSyntax("xx-small | x-small | small", [], [])).toMatchObject({
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "xx-small",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "x-small",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "small",
                    refCombinatorType: "none",
                    type: "value",
                },
            ],
            refCombinatorType: "exactlyOne",
        });
    });
    test("should resolve a CSS syntax with grouped items", () => {
        expect(resolveCSSSyntax("foo [ bar | bat ]", [], [])).toMatchObject({
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "foo",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bar",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bat",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                    multiplier: null,
                    prepend: null,
                    type: "group",
                },
            ],
            refCombinatorType: "juxtaposition",
        });
    });
});

test.describe("mapCSSSyntaxes", () => {
    test("should return a subset of MDN data into a subset of CSS syntaxes", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                "absolute-size": {
                    syntax: "xx-small | x-small | small",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toMatchObject({
            "absolute-size": {
                name: "absolute-size",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "xx-small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "x-small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with parenthesis", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                color: {
                    syntax: "<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>",
                },
                "rgb()": {
                    syntax: "foo",
                },
                "rgba()": {
                    syntax: "bar",
                },
                "hsl()": {
                    syntax: "baz",
                },
                "hsla()": {
                    syntax: "qux",
                },
                "deprecated-system-color": {
                    syntax: "quux",
                },
            },
            types: mdnCSS.types,
        } as any;

        expect(mapCSSSyntaxes(subsetOfMDNCSS).color).toMatchObject({
            name: "color",
            value: {
                ref: [
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<rgb()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<rgba()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hsl()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hsla()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hex-color>",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<named-color>",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "currentcolor",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<deprecated-system-color>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                ],
                refCombinatorType: "exactlyOne",
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with numerals", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "3d | 2d | 42",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toMatchObject({
            foo: {
                name: "foo",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "3d",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "2d",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "42",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with capital letters", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "Foo | bAr | baT",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toMatchObject({
            foo: {
                name: "foo",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "Foo",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bAr",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "baT",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
});

test.describe("mapMixedCombinatorTypes", () => {
    test("should add brackets if there are multiple combinator types", () => {
        const syntax1: string = "foo | bar bat";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual("foo | [ bar bat ]");
        const syntax2: string = "foo bar | bat";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual("[ foo bar ] | bat");
        const syntax3: string = "foo && bar || bat";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual("[ foo && bar ] || bat");
        const syntax4: string = "foo || bar && bat";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual("[ foo || bar ] && bat");
    });
    test("should not add brackets if all combinator types match", () => {
        const syntax: string = "foo | bar | bat";
        expect(mapMixedCombinatorTypes(syntax)).toEqual(syntax);
    });
    test("should add brackets if brackets already exist and there are multiple combinator types", () => {
        const syntax1: string = "[ foo | bar ] bat && baz";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual("[ [ foo | bar ] bat ] && baz");
        const syntax2: string = "[ foo bar ] | bat && baz";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual("[ foo bar ] | [ bat && baz ]");
        const syntax3: string = "foo && baz [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual("[ foo && baz ] [ bar || bat ]");
        const syntax4: string = "foo || [ bar && bat ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual("[ foo || [ bar && bat ] ] baz");
    });
    test("should not add brackets if brackets already exist and all combinator types match", () => {
        const syntax1: string = "[ [ foo | bar ] bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual(syntax1);
        const syntax2: string = "[ [ foo bar ] | bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual(syntax2);
        const syntax3: string = "[ foo && baz ] [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual(syntax3);
        const syntax4: string = "[ foo || [ bar && bat ] ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual(syntax4);
    });
    test("should not add brackets if multiple brackets exist and all combinator types match", () => {
        const syntax1: string =
            "foo | [ [ bar | baz ] || [ qux | quux | quuz | corge | grault ] ] | garply";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual(syntax1);
    });
});

test.describe("mapCSSInlineStyleToCSSPropertyDictionary", () => {
    test("should return an empty dictionary if the style is an empty string", () => {
        expect(mapCSSInlineStyleToCSSPropertyDictionary("")).toMatchObject({});
    });
    test("should return a dictionary with one item if the style contains one style item without an ending semi-colon", () => {
        expect(
            mapCSSInlineStyleToCSSPropertyDictionary("background-color: red")
        ).toMatchObject({
            "background-color": "red",
        });
    });
    test("should return a dictionary with one item if the style contains one style item with an ending semi-colon", () => {
        expect(
            mapCSSInlineStyleToCSSPropertyDictionary("background-color: red;")
        ).toMatchObject({
            "background-color": "red",
        });
    });
    test("should return a dictionary with multiple items if the style contains multiple items", () => {
        expect(
            mapCSSInlineStyleToCSSPropertyDictionary(
                "background-color: red; border: 1px solid black; color: #FFFFFF; transform: translate(120px, 50%);"
            )
        ).toMatchObject({
            "background-color": "red",
            border: "1px solid black",
            color: "#FFFFFF",
            transform: "translate(120px, 50%)",
        });
    });
    test("should return a dictionary with multiple items with inconsistent spacing", () => {
        expect(
            mapCSSInlineStyleToCSSPropertyDictionary(
                "background-color: red;  border: 1px solid black;color: #FFFFFF; transform: translate(120px, 50%)  "
            )
        ).toMatchObject({
            "background-color": "red",
            border: "1px solid black",
            color: "#FFFFFF",
            transform: "translate(120px, 50%)",
        });
    });
});
