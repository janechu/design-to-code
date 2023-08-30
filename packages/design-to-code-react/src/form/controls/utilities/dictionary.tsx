import React, { useState } from "react";
import { isPlainObject, uniqueId } from "lodash-es";
import { keyEnter } from "@microsoft/fast-web-utilities";
import { PropertyKeyword } from "design-to-code";
import { DictionaryProps } from "./dictionary.props";
import ControlSwitch from "./control-switch";
import { generateExampleData, getErrorFromDataLocation } from "./form";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import controlStyle from "design-to-code/dist/stylesheets/web-components/style/common.control.css";
import labelStyle from "design-to-code/dist/stylesheets/web-components/style/common.label.css";
import controlRegionStyle from "design-to-code/dist/stylesheets/web-components/style/common.control-region.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import removeItemStyle from "design-to-code/dist/stylesheets/web-components/style/common.remove-item.css";
import addItemStyle from "design-to-code/dist/stylesheets/web-components/style/common.add-item.css";
import style from "./dictionary.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

// tree-shaking
cssVariables;
controlStyle;
labelStyle;
controlRegionStyle;
inputStyle;
removeItemStyle;
addItemStyle;
style;

/**
 *  control definition
 */
function Dictionary(props: DictionaryProps) {
    const rootElementRef: React.RefObject<HTMLDivElement> =
        React.createRef<HTMLDivElement>();

    const [focusedPropertyKey, setFocusedPropertyKey] = useState(null);
    const [focusedPropertyKeyValue, setFocusedPropertyKeyValue] = useState(null);

    function updateValidity(): void {
        if (props.additionalProperties === false) {
            rootElementRef.current
                .querySelectorAll<HTMLInputElement>(
                    `.${`dtc-dictionary_item-control-input ${dtcClassName.commonInput}`}`
                )
                .forEach((itemControlInput: HTMLInputElement) => {
                    itemControlInput.setCustomValidity(
                        "should NOT have additional properties"
                    );
                });
        }
    }

    function renderControl(): React.ReactNode {
        if (isPlainObject(props.additionalProperties)) {
            return (
                <div
                    className={`dtc-dictionary_control-region ${dtcClassName.commonControlRegion}`}
                >
                    <div
                        className={`dtc-dictionary_control ${dtcClassName.commonControl}`}
                    >
                        <label
                            className={`dtc-dictionary_control-label ${dtcClassName.commonLabel}`}
                        >
                            {props.label}
                        </label>
                    </div>
                    <button
                        className={`dtc-dictionary_control-add-trigger ${dtcClassName.commonAddItem}`}
                        aria-label={"Select to add item"}
                        onClick={handleOnAddItem}
                    />
                </div>
            );
        }
    }

    function renderItemControl(propertyName: string): React.ReactNode {
        return (
            <div
                className={`dtc-dictionary_item-control-region ${dtcClassName.commonControlRegion}`}
            >
                <div
                    className={`dtc-dictionary_item-control ${dtcClassName.commonControl}`}
                >
                    <label
                        className={`dtc-dictionary_item-control-label ${dtcClassName.commonLabel}`}
                    >
                        {props.propertyLabel}
                    </label>
                    <input
                        className={`dtc-dictionary_item-control-input ${dtcClassName.commonInput}`}
                        type={"text"}
                        value={
                            focusedPropertyKey === propertyName
                                ? focusedPropertyKeyValue
                                : propertyName
                        }
                        onFocus={handleKeyFocus(propertyName)}
                        onBlur={handleKeyBlur(propertyName)}
                        onKeyDown={handleKeyPress()}
                        onChange={handleKeyChange(propertyName)}
                        readOnly={props.additionalProperties === false}
                    />
                    <button
                        className={`dtc-dictionary_item-control-remove-trigger ${dtcClassName.commonRemoveItem}`}
                        onClick={handleOnRemoveItem(propertyName)}
                    />
                </div>
            </div>
        );
    }

    function renderControls(): React.ReactNode {
        return (typeof props.data !== "undefined" ? Object.keys(props.data) : []).reduce(
            (
                accumulator: React.ReactNode,
                currentKey: string,
                index: number
            ): React.ReactNode => {
                if (!props.enumeratedProperties.includes(currentKey)) {
                    const dataLocation: string = getDataLocation(currentKey);
                    const invalidMessage: string = getErrorFromDataLocation(
                        dataLocation,
                        props.validationErrors
                    );

                    return (
                        <React.Fragment key={dataLocation}>
                            {accumulator}
                            <div key={props.schemaLocation + index}>
                                {renderItemControl(currentKey)}
                                <ControlSwitch
                                    index={index}
                                    controls={props.controls}
                                    controlPlugins={props.controlPlugins}
                                    controlComponents={props.controlComponents}
                                    label={props.label}
                                    onChange={props.onChange}
                                    propertyName={currentKey}
                                    schemaLocation={getSchemaLocation(currentKey)}
                                    dataLocation={dataLocation}
                                    data={getData(currentKey)}
                                    schema={props.additionalProperties}
                                    disabled={props.additionalProperties === false}
                                    onUpdateSection={props.onUpdateSection}
                                    required={isRequired(currentKey)}
                                    invalidMessage={invalidMessage}
                                    softRemove={false}
                                    displayValidationInline={
                                        props.displayValidationInline
                                    }
                                    displayValidationBrowserDefault={
                                        props.displayValidationBrowserDefault
                                    }
                                    strings={props.strings}
                                    type={props.type}
                                    categories={props.categories}
                                    untitled={props.untitled}
                                    dictionaryId={props.dictionaryId}
                                    dataDictionary={props.dataDictionary}
                                    navigation={props.navigation}
                                    navigationConfigId={props.navigationConfigId}
                                    validationErrors={props.validationErrors}
                                    schemaDictionary={props.schemaDictionary}
                                    messageSystem={props.messageSystem}
                                    messageSystemOptions={props.messageSystemOptions}
                                />
                            </div>
                        </React.Fragment>
                    );
                }
                return accumulator;
            },
            null
        );
    }

    function handleOnAddItem(e: React.MouseEvent<HTMLButtonElement>): void {
        const key: string = uniqueId("example");

        if (typeof props.default !== "undefined") {
            props.onChange({
                dataLocation: `${
                    props.dataLocation === "" ? "" : `${props.dataLocation}.`
                }${key}`,
                dictionaryId: props.dictionaryId,
                value: props.default,
            });
        } else if (Array.isArray(props.examples) && props.examples.length > 0) {
            props.onChange({
                dataLocation: `${
                    props.dataLocation === "" ? "" : `${props.dataLocation}.`
                }${key}`,
                dictionaryId: props.dictionaryId,
                value: props.examples[0],
            });
        } else {
            props.onChange({
                dataLocation: `${
                    props.dataLocation === "" ? "" : `${props.dataLocation}.`
                }${key}`,
                dictionaryId: props.dictionaryId,
                value: generateExampleData(
                    props.schemaDictionary[
                        props.dataDictionary[0][props.dictionaryId].schemaId
                    ],
                    props.additionalProperties,
                    ""
                ),
            });
        }
    }

    function handleOnRemoveItem(
        propertyName: string
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            props.onChange({
                dataLocation: `${
                    props.dataLocation === "" ? "" : `${props.dataLocation}.`
                }${propertyName}`,
                dictionaryId: props.dictionaryId,
                value: void 0,
            });
        };
    }

    function handleKeyPress(): (e: React.KeyboardEvent<HTMLInputElement>) => void {
        return (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === keyEnter) {
                e.currentTarget.blur();
                e.preventDefault();
            }
        };
    }

    function handleKeyChange(
        propertyName: string
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            setFocusedPropertyKeyValue(e.target.value);
        };
    }

    function handleKeyFocus(
        propertyName: string
    ): (e: React.FocusEvent<HTMLInputElement>) => void {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            setFocusedPropertyKey(propertyName);
            setFocusedPropertyKeyValue(propertyName);
        };
    }

    function handleKeyBlur(
        propertyName: string
    ): (e: React.FocusEvent<HTMLInputElement>) => void {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            const dataKeys: string[] =
                typeof props.data === "undefined" ? [] : Object.keys(props.data);
            const data: any = {};

            dataKeys.forEach((dataKey: string) => {
                data[dataKey === propertyName ? e.target.value : dataKey] =
                    props.data[dataKey];
            });

            props.onChange({
                dataLocation: props.dataLocation,
                dictionaryId: props.dictionaryId,
                value: data,
            });

            setFocusedPropertyKey(null);
            setFocusedPropertyKeyValue(null);
        };
    }

    function getSchemaLocation(propertyName: string): string {
        return `${props.schemaLocation === "" ? "" : `${props.schemaLocation}.`}${
            PropertyKeyword.additionalProperties
        }.${propertyName}`;
    }

    function getDataLocation(propertyName: string): string {
        return `${props.dataLocation}${
            props.dataLocation !== "" ? "." : ""
        }${propertyName}`;
    }

    function getData(propertyName: string): any {
        return props.data[propertyName];
    }

    function isRequired(propertyName: string): any {
        return Array.isArray(props.required) && props.required.includes(propertyName);
    }

    return (
        <div className={"dtc-dictionary"} ref={rootElementRef}>
            {renderControl()}
            {renderControls()}
        </div>
    );
}

export { Dictionary };
export default Dictionary;
