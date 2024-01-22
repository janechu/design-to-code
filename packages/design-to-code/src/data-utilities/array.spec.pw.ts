import { expect, test } from "../__test__/base-fixtures";
import { isInArray } from "./array.js";

/**
 * Checks that the data is in an array
 */
test.describe("isInArray", () => {
    test("should return false when data is not an array and the data location is the root", () => {
        expect(isInArray({}, "")).toEqual(false);
    });
    test("should return false when data is not an array and the data location is in a sub location", () => {
        expect(
            isInArray(
                {
                    foo: {},
                },
                "foo"
            )
        ).toEqual(false);
    });
    test("should return true when data is an array and the data location is in a sub location", () => {
        expect(isInArray(["foo"], "[0]")).toEqual(false);
    });
});
