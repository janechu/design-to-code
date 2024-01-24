import Ajv, { ValidateFunction } from "ajv";
import { expect, test } from "../__test__/base-fixtures.js";
import { linkedDataSchema } from "./index.js";

const validator: Ajv = new Ajv({ allErrors: true, strict: false });
const validationFn: ValidateFunction = validator.compile(linkedDataSchema);

test.describe("linked data schema", () => {
    test("should be valid against an array of linked data corresponding to the linekd data schema", () => {
        expect(validationFn([{ id: "foo" }])).toEqual(true);
    });
});
