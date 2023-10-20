import Ajv2019, { ErrorObject, Options } from "ajv";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemSchemaValidationTypeAction,
    MessageSystemType,
    MessageSystemValidationTypeAction,
    NavigationConfigDictionary,
    SchemaDictionary,
    SchemaSetValidationAction,
    SchemaSetValidationMessageResponse,
    Validation,
    ValidationConfig,
    ValidationError,
} from "../message-system/index.js";
import {
    normalizeDataLocationToDotNotation,
    normalizeURIToDotNotation,
} from "../data-utilities/location.js";

export const ajvValidationId = "design-to-code::ajv-validation-service";

export interface AjvValidatorConfig {
    /**
     * The message system
     * used for sending and receiving validation to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Ajv library options
     */
    ajvOptions?: Options;
}

const SchemaAdded = {
    success: "success",
    errorInvalidSchema: "errorInvalidSchema",
} as const;

export class AjvValidator {
    private activeDictionaryId: string;
    private navigationDictionary: NavigationConfigDictionary;
    private validation: Validation = {};
    private schemaValidation: ValidationError[] = [];
    private schemaDictionary: SchemaDictionary = {};
    private messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    private ajv: Ajv2019;

    constructor(config: AjvValidatorConfig) {
        if (config.messageSystem !== undefined) {
            this.messageSystemConfig = {
                onMessage: this.handleMessageSystem,
            };
            config.messageSystem.add(this.messageSystemConfig);
        }

        this.messageSystem = config.messageSystem;

        const ajvOptions = config.ajvOptions ? config.ajvOptions : {};

        this.ajv = new Ajv2019({ allErrors: true, ...ajvOptions });
    }

    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    public destroy(): void {
        this.messageSystem.remove(this.messageSystemConfig);
    }

    private postMessage(validationErrors: ValidationConfig, dictionaryId: string): void {
        if (validationErrors.type === "instance") {
            this.validation[dictionaryId] = validationErrors.errors;

            this.messageSystem.postMessage({
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.update,
                validationErrors: this.validation[dictionaryId],
                dictionaryId: dictionaryId,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        } else {
            this.schemaValidation = validationErrors.errors;

            this.messageSystem.postMessage({
                type: MessageSystemType.schemaValidation,
                action: MessageSystemSchemaValidationTypeAction.update,
                validationErrors: this.schemaValidation,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        }
    }

    /**
     * Handles messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        let validationErrors;

        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.activeDictionaryId = e.data.activeDictionaryId;
                this.navigationDictionary = e.data.navigationDictionary;
                this.validation = {};

                validationErrors = this.validate(
                    this.navigationDictionary[0][e.data.activeDictionaryId][0][
                        this.navigationDictionary[0][e.data.activeDictionaryId][1]
                    ].data,
                    this.navigationDictionary[0][e.data.activeDictionaryId][0][
                        this.navigationDictionary[0][e.data.activeDictionaryId][1]
                    ].schema
                );

                this.postMessage(validationErrors, e.data.activeDictionaryId);

                break;
            case MessageSystemType.data:
                if (
                    e.data.action === MessageSystemDataTypeAction.add ||
                    e.data.action === MessageSystemDataTypeAction.duplicate ||
                    e.data.action === MessageSystemDataTypeAction.update ||
                    e.data.action === MessageSystemDataTypeAction.addLinkedData
                ) {
                    this.navigationDictionary = e.data.navigationDictionary;

                    if (e.data.action === MessageSystemDataTypeAction.addLinkedData) {
                        const linkedDataRootId: string = e.data.navigation[1];
                        const validationErrors = this.validate(
                            e.data.navigation[0][linkedDataRootId].data,
                            e.data.navigation[0][linkedDataRootId].schema
                        );

                        this.postMessage(validationErrors, linkedDataRootId);
                    } else {
                        const validationErrors = this.validate(
                            this.navigationDictionary[0][this.activeDictionaryId][0][
                                this.navigationDictionary[0][this.activeDictionaryId][1]
                            ].data,
                            this.navigationDictionary[0][this.activeDictionaryId][0][
                                this.navigationDictionary[0][this.activeDictionaryId][1]
                            ].schema
                        );

                        this.postMessage(validationErrors, this.activeDictionaryId);
                    }
                }

                break;
            case MessageSystemType.custom:
                if (e.data.action === SchemaSetValidationAction.request) {
                    this.messageSystem.postMessage({
                        type: MessageSystemType.custom,
                        action: SchemaSetValidationAction.response,
                        id: e.data.id,
                        index: this.findValidSchema(e.data.schemas, e.data.data),
                        options: {
                            originatorId: ajvValidationId,
                        },
                    } as SchemaSetValidationMessageResponse);
                }
        }
    };

    /**
     * Normalize the dataPaths provided by Ajv to the dataLocation path syntax
     */
    private normalizeAjvDataPath(dataPath: string): string {
        return normalizeDataLocationToDotNotation(
            normalizeURIToDotNotation(
                dataPath
                    .replace(/(\[')/g, ".")
                    .replace(/('\])/g, "")
                    .replace(/^(\.+)/, "")
            )
        );
    }

    /**
     * Validate the data against multiple schemas
     * and return the first valid index or if none
     * are valid, return -1
     */
    private findValidSchema(schemas: any[], data: any): number {
        for (let i = 0, schemasLength = schemas.length; i < schemasLength; i++) {
            if (this.ajv.compile(schemas[i])(data)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Add a JSON schema to AJV
     */
    private addSchemaToAjv(schema: any): keyof typeof SchemaAdded {
        if (typeof schema.$id === "string" && this.ajv.validateSchema(schema) === true) {
            this.ajv.addSchema(schema, schema.$id);
            return SchemaAdded.success;
        }

        return SchemaAdded.errorInvalidSchema;
    }

    /**
     * Validates the data and schema
     */
    private validate = (data: any, schema: any): ValidationConfig => {
        // convert the $schema keyword to use http://json-schema.org/schema#
        // as dialect 2019-09 is implied but will throw an error
        if (
            schema.$schema !== "https://json-schema.org/draft/2019-09/schema" &&
            schema.$schema !== "http://json-schema.org/schema#"
        ) {
            console.warn(
                `$schema ${schema.$schema} is not officially supported by the ajv validation service`
            );
        }

        schema.$schema = "http://json-schema.org/schema#";

        // if this data has never been validated against,
        // add the schema to ajv
        if (this.schemaDictionary[schema.$id] === undefined) {
            this.schemaDictionary[schema.$id] = schema;

            const schemaAdded = this.addSchemaToAjv(schema);

            if (schemaAdded === SchemaAdded.errorInvalidSchema) {
                return {
                    type: "schema",
                    errors: this.getErrors("schema", schema.$id),
                };
            }
        }

        const ajvValidationObject = this.ajv.validate(schema.$id, data);

        if (ajvValidationObject === true) {
            return {
                type: "instance",
                errors: [],
            };
        } else {
            return {
                type: "instance",
                errors: this.getErrors("instance", schema.$id),
            };
        }
    };

    private getErrors(
        source: "schema" | "instance",
        schemaId: string
    ): ValidationError[] {
        switch (source) {
            case "instance":
                return (this.ajv.errors || []).map((AjvError: ErrorObject) => {
                    let ajvPath = AjvError.instancePath;

                    if (AjvError.keyword === "required") {
                        ajvPath = [ajvPath, AjvError.params.missingProperty].join(".");
                    }

                    const dataLocation = this.normalizeAjvDataPath(ajvPath);

                    return {
                        dataLocation,
                        activeDictionaryId: this.activeDictionaryId,
                        activeNavigationConfigId: dataLocation,
                        invalidMessage: AjvError.message,
                    };
                });
            case "schema":
                return [
                    {
                        invalidMessage: `${schemaId} is an invalid schema, or it may be missing an $id`,
                    },
                ];
        }
    }
}
