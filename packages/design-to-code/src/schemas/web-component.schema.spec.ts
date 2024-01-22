import Ajv, { ValidateFunction } from "ajv";
import { expect, test } from "../__test__/base-fixtures";
import { webComponentSchema } from "./index.js";

const validator: Ajv = new Ajv({ allErrors: true });
const validationFn: ValidateFunction = validator.compile(webComponentSchema);

test.describe.only("web component schema", () => {
    test("should be valid against a web component schema", () => {
        expect(
            validationFn({
                version: 1,
            })
        ).toEqual(true);
    });
});
