import ajv from "ajv";
import { expect, test } from "@playwright/test";
import { webComponentSchema } from "./index.js";

const validator: ajv.Ajv = new ajv({ schemaId: "auto", allErrors: true });
const validationFn: ajv.ValidateFunction = validator.compile(webComponentSchema);

test.describe.only("web component schema", () => {
    test("should be valid against a web component schema", () => {
        expect(
            validationFn({
                version: 1,
            })
        ).toEqual(true);
    });
});
