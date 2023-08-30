import {
    checkIsDifferentSchema,
    getCategoryStateFromCategoryDictionary,
    getData,
    getErrorFromDataLocation,
    getLabel,
    getOneOfAnyOfSelectOptions,
    getUpdatedCategories,
    updateControlSectionState,
} from "./utilities/form";
import React, { useEffect, useState } from "react";
import { get, uniqueId } from "lodash-es";
import { CategoryState, SectionControlProps } from "./control.section.props";
import SectionControlValidation from "./utilities/section.validation";
import FormControlSwitch from "./utilities/control-switch";
import FormOneOfAnyOf from "./utilities/section.one-of-any-of";
import FormDictionary from "./utilities/dictionary";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    CombiningKeyword,
    MessageSystemType,
    Register,
    SchemaSetValidationAction,
    SchemaSetValidationMessageRequest,
    TreeNavigationItem,
} from "design-to-code";
import style from "./control.section.style.css";

// tree-shaking
style;

/**
 * Schema form component definition
 */
function SectionControl(props: SectionControlProps) {
    /**
     * The message system registration configuration
     */
    const messageSystemConfig: Register = {
        onMessage: handleMessageSystem,
    };

    /**
     * The ID of the requested validation
     */
    let oneOfAnyOfValidationRequestId: string = `${props.schema.$id}-${props.dataLocation}`;

    const invalidMessage: string = getErrorFromDataLocation(
        props.dataLocation,
        props.validationErrors
    );

    const [schema, setSchema] = useState(props.schema);
    const [oneOfAnyOf, setOneOfAnyOf] = useState(null);
    const [categories, setCategories] = useState(
        getCategoryStateFromCategoryDictionary(
            props.categories,
            props.dataDictionary,
            props.dictionaryId,
            props.dataLocation
        )
    );

    const disabled: boolean = isDisabled();

    useEffect(() => {
        if (checkIsDifferentSchema(schema, props.schema)) {
            const updatedState = updateControlSectionState(props, {
                schema,
                oneOfAnyOf,
                categories,
            });

            if (updatedState.oneOfAnyOf !== null) {
                props.messageSystem.postMessage({
                    type: MessageSystemType.custom,
                    action: SchemaSetValidationAction.request,
                    id: oneOfAnyOfValidationRequestId,
                    schemas: props.schema[updatedState.oneOfAnyOf.type],
                    data: props.value,
                } as SchemaSetValidationMessageRequest);
            }

            setSchema(updatedState.schema);
            setCategories(updatedState.categories);
            setOneOfAnyOf(
                props.navigation[props.navigationConfigId].schema[CombiningKeyword.anyOf]
                    ? {
                          type: CombiningKeyword.anyOf,
                          activeIndex: -1,
                      }
                    : props.navigation[props.navigationConfigId].schema[
                          CombiningKeyword.oneOf
                      ]
                    ? {
                          type: CombiningKeyword.oneOf,
                          activeIndex: -1,
                      }
                    : null
            );
        }

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(messageSystemConfig);
        }

        return function cancel() {
            if (props.messageSystem !== undefined) {
                props.messageSystem.remove(messageSystemConfig);
            }
        };
    });

    /**
     * Handle the message system messages
     */
    function handleMessageSystem(e: MessageEvent): void {
        switch (e.data.type) {
            case MessageSystemType.custom:
                if (
                    e.data.action === SchemaSetValidationAction.response &&
                    e.data.id === oneOfAnyOfValidationRequestId &&
                    oneOfAnyOf !== null &&
                    e.data.index !== undefined
                ) {
                    setOneOfAnyOf({
                        type: oneOfAnyOf.type,
                        activeIndex: e.data.index,
                    });
                }
        }
    }

    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    function handleAnyOfOneOfClick(activeIndex: number): void {
        setOneOfAnyOf({
            type: oneOfAnyOf.type,
            activeIndex,
        });
    }

    /**
     * Generates form elements based on field type
     */
    function renderFormControl(
        schema: any,
        propertyName: string,
        schemaLocation: string,
        dataLocation: string,
        navigationId: string,
        required: boolean,
        disabled: boolean,
        label: string,
        invalidMessage: string | null,
        index: number
    ): React.ReactNode {
        // if this is a root level object use it to generate the form and do not generate a link
        if (schema.type === "object" && propertyName === "") {
            return getFormControls();
        }

        return (
            <FormControlSwitch
                key={dataLocation}
                controls={props.controls}
                controlPlugins={props.controlPlugins}
                controlComponents={props.controlComponents}
                untitled={props.untitled}
                required={required}
                disabled={disabled}
                default={get(props.default, propertyName)}
                label={getLabel(label, schema.title)}
                data={getData(propertyName, props.value)}
                dataLocation={dataLocation}
                dictionaryId={props.dictionaryId}
                dataDictionary={props.dataDictionary}
                schemaDictionary={props.schemaDictionary}
                navigationConfigId={navigationId}
                navigation={props.navigation}
                schemaLocation={schemaLocation}
                propertyName={propertyName}
                schema={schema}
                onChange={props.onChange}
                onUpdateSection={props.onUpdateSection}
                invalidMessage={invalidMessage}
                validationErrors={props.validationErrors}
                displayValidationBrowserDefault={props.displayValidationBrowserDefault}
                displayValidationInline={props.displayValidationInline}
                messageSystem={props.messageSystem}
                strings={props.strings}
                messageSystemOptions={props.messageSystemOptions}
                type={props.type}
                categories={props.categories}
                index={index}
            />
        );
    }

    function getFormControl(item: string, index: number): React.ReactNode {
        const splitDataLocation: string[] =
            props.navigation[item].relativeDataLocation.split(".");
        const propertyName: string = splitDataLocation[splitDataLocation.length - 1];
        const requiredArray: string[] | void =
            props.navigation[props.navigationConfigId].schema.required;
        const isRequired: boolean =
            Array.isArray(requiredArray) && requiredArray.includes(propertyName);

        return renderFormControl(
            props.navigation[item].schema,
            propertyName,
            props.navigation[item].schemaLocation,
            props.navigation[item].relativeDataLocation,
            item,
            isRequired,
            props.navigation[item].disabled,
            props.navigation[item].schema.title || props.untitled,
            getErrorFromDataLocation(
                props.navigation[item].relativeDataLocation,
                props.validationErrors
            ),
            index
        );
    }

    function getFormControls(): React.ReactNode {
        const navigationItem: TreeNavigationItem = getActiveTreeNavigationItem();

        if (
            categories &&
            props.categories &&
            props.categories[props.dataDictionary[0][props.dictionaryId].schemaId] &&
            props.categories[props.dataDictionary[0][props.dictionaryId].schemaId][
                props.dataLocation
            ]
        ) {
            const formControls: React.ReactNode[] = [];
            const categorizedControls: string[] = [];

            categories.forEach((categoryItem: CategoryState, index: number) => {
                const category =
                    props.categories[
                        props.dataDictionary[0][props.dictionaryId].schemaId
                    ][props.dataLocation][index];
                formControls.push(
                    <fieldset
                        key={index}
                        className={classNames("dtc-section-control_category", [
                            "dtc-section-control_category__expanded",
                            categoryItem.expanded,
                        ])}
                    >
                        <div className={"dtc-section-control_category-title-region"}>
                            <legend className={"dtc-section-control_category-title"}>
                                {category.title}
                            </legend>
                            <button
                                className={"dtc-section-control_category-expand-trigger"}
                                onClick={handleCategoryExpandTriggerClick(index)}
                            />
                        </div>
                        <div className={"dtc-section-control_category-content-region"}>
                            {category.dataLocations.map(
                                (dataLocation: string, index: number) => {
                                    if (
                                        navigationItem.items.findIndex(
                                            item => item === dataLocation
                                        ) !== -1
                                    ) {
                                        categorizedControls.push(dataLocation);
                                        return getFormControl(dataLocation, index);
                                    }

                                    return null;
                                }
                            )}
                        </div>
                    </fieldset>
                );
            });

            return [
                ...navigationItem.items
                    .reduce((accumulation: string[], item: string) => {
                        if (
                            categorizedControls.findIndex(
                                categorizedControl => categorizedControl === item
                            ) === -1
                        ) {
                            accumulation.push(item);
                        }

                        return accumulation;
                    }, [])
                    .map((uncategorizedControl: string, index: number) => {
                        return getFormControl(uncategorizedControl, index);
                    }),
                ...formControls,
            ];
        }

        return navigationItem.items.map(
            (item: string, index: number): React.ReactNode => {
                return getFormControl(item, index);
            }
        );
    }

    /**
     * Renders a select if the root level has a oneOf or anyOf
     */
    function renderAnyOfOneOfSelect(): JSX.Element {
        if (oneOfAnyOf !== null && props.schema[oneOfAnyOf.type]) {
            const unselectedOption: React.ReactNode = (
                <option value={-1}>{props.strings.sectionSelectDefault}</option>
            );
            const options: React.ReactNode = getOneOfAnyOfSelectOptions(props.schema, {
                oneOfAnyOf,
            });

            return (
                <FormOneOfAnyOf
                    label={get(props, "schema.title", props.strings.sectionSelectLabel)}
                    activeIndex={oneOfAnyOf.activeIndex}
                    onUpdate={handleAnyOfOneOfClick}
                >
                    {unselectedOption}
                    {options}
                </FormOneOfAnyOf>
            );
        }

        return null;
    }

    /**
     * Renders additional properties if they have been declared
     */
    function renderAdditionalProperties(): JSX.Element {
        const navigationItem: TreeNavigationItem = getActiveTreeNavigationItem();

        if (
            typeof navigationItem.schema.additionalProperties === "object" ||
            navigationItem.schema.additionalProperties === false
        ) {
            return (
                <FormDictionary
                    index={0}
                    type={props.type}
                    controls={props.controls}
                    controlPlugins={props.controlPlugins}
                    controlComponents={props.controlComponents}
                    formControlId={schema.formControlId}
                    dataLocation={props.dataLocation}
                    navigationConfigId={props.navigationConfigId}
                    dictionaryId={props.dictionaryId}
                    dataDictionary={props.dataDictionary}
                    navigation={props.navigation}
                    schemaLocation={navigationItem.schemaLocation}
                    examples={get(
                        navigationItem.schema,
                        props.strings.sectionAdditionalPropExample
                    )}
                    propertyLabel={get(
                        navigationItem.schema,
                        `propertyTitle`,
                        props.strings.sectionAdditionalPropLabel
                    )}
                    additionalProperties={navigationItem.schema.additionalProperties}
                    enumeratedProperties={getEnumeratedProperties(navigationItem.schema)}
                    data={props.value}
                    schema={navigationItem.schema}
                    schemaDictionary={props.schemaDictionary}
                    required={navigationItem.schema.required}
                    label={navigationItem.schema.title || props.untitled}
                    onChange={props.onChange}
                    onUpdateSection={props.onUpdateSection}
                    validationErrors={props.validationErrors}
                    displayValidationBrowserDefault={
                        props.displayValidationBrowserDefault
                    }
                    displayValidationInline={props.displayValidationInline}
                    messageSystem={props.messageSystem}
                    strings={props.strings}
                    messageSystemOptions={props.messageSystemOptions}
                    categories={props.categories}
                />
            );
        }

        return null;
    }

    function renderFormValidation(invalidMessage: string): JSX.Element {
        if (invalidMessage !== "") {
            return (
                <SectionControlValidation
                    invalidMessage={invalidMessage}
                    validationErrors={props.validationErrors}
                    dataLocation={props.dataLocation}
                />
            );
        }
    }

    function renderSectionControl(invalidMessage: string): JSX.Element {
        const navigationItem: TreeNavigationItem = getActiveTreeNavigationItem();

        return (
            <div>
                <div>
                    {renderAnyOfOneOfSelect()}
                    {renderFormControl(
                        navigationItem.schema,
                        "",
                        navigationItem.schemaLocation,
                        props.dataLocation,
                        navigationItem.self,
                        true,
                        props.disabled || schema.disabled,
                        "",
                        invalidMessage,
                        0
                    )}
                    {renderAdditionalProperties()}
                </div>
            </div>
        );
    }

    function handleCategoryExpandTriggerClick(index: number): () => void {
        return () => {
            const updatedCategories = getUpdatedCategories(categories, index);

            setCategories(updatedCategories);
        };
    }

    function getActiveTreeNavigationItem(): TreeNavigationItem {
        return oneOfAnyOf === null
            ? props.navigation[props.navigationConfigId]
            : oneOfAnyOf.activeIndex === -1
            ? props.navigation[props.navigation[props.navigationConfigId].items[0]]
            : props.navigation[
                  props.navigation[props.navigationConfigId].items[oneOfAnyOf.activeIndex]
              ];
    }

    /**
     * Get all enumerated properties for the object
     */
    function getEnumeratedProperties(schema: any): string[] {
        return Object.keys(schema.properties || {});
    }

    function isDisabled(): boolean {
        return props.disabled || schema.disabled;
    }

    return (
        <fieldset
            className={classNames("dtc-section-control", [
                "dtc-section-control__disabled",
                disabled,
            ])}
            disabled={disabled}
        >
            {renderFormValidation(invalidMessage)}
            {renderSectionControl(invalidMessage)}
        </fieldset>
    );
}

export { SectionControl };
export default SectionControl;
