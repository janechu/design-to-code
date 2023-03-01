import ajv from "ajv";
import { expect, test } from "@playwright/test";
import { linkedDataSchema } from "./index.js";

const validator: ajv.Ajv = new ajv({ schemaId: "auto", allErrors: true });
const validationFn: ajv.ValidateFunction = validator.compile(linkedDataSchema);

test.describe.only("linked data schema", () => {
    test("should be valid against an array of linked data corresponding to the linekd data schema", () => {
        expect(validationFn([{ id: "foo" }])).toEqual(true);
    });
});
