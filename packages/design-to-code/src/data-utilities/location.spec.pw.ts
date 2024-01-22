import { expect, test } from "../__test__/base-fixtures.js";
import {
    normalizeDataLocationToDotNotation,
    normalizeURIToDotNotation,
} from "./location.js";

test.describe("normalizeDataLocationToDotLocation", () => {
    test("should convert a bracket location to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("[0]")).toEqual("0");
    });
    test("should convert a bracket location to a dot location if the array is a property on an object", () => {
        expect(normalizeDataLocationToDotNotation("foo[0]")).toEqual("foo.0");
    });
    test("should convert a bracket location that is nested in properties to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("foo[0].bar")).toEqual("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("[0].foo.bar")).toEqual("0.foo.bar");
    });
    test("should not perform conversions on locations that are already dot locations", () => {
        expect(normalizeDataLocationToDotNotation("0")).toEqual("0");
        expect(normalizeDataLocationToDotNotation("foo.0")).toEqual("foo.0");
        expect(normalizeDataLocationToDotNotation("foo.0.bar")).toEqual("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("0.foo.bar")).toEqual("0.foo.bar");
    });
});

test.describe("normalizeURIToDotNotation", () => {
    test("should convert a root level fragment URI to dot location", () => {
        expect(normalizeURIToDotNotation("#")).toEqual("");
    });
    test("should convert a fragment URI to dot location", () => {
        expect(normalizeURIToDotNotation("#/foo/bar")).toEqual("foo.bar");
    });
});
