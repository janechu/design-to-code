import React from "react";
import { isPlainObject, uniqueId } from "lodash-es";
import { keyEnter } from "@microsoft/fast-web-utilities";
import { PropertyKeyword } from "design-to-code";
import { DictionaryProps, DictionaryState } from "./dictionary.props";
import ControlSwitch from "./control-switch";
import { generateExampleData, getErrorFromDataLocation } from "./form";
import cssVariables from "../../../style/css-variables.css";
import controlStyle from "../../../style/control-style.css";
import labelStyle from "../../../style/label-style.css";
import controlRegionStyle from "../../../style/control-region-style.css";
import inputStyle from "../../../style/input-style.css";
import removeItemStyle from "../../../style/remove-item-style.css";
import addItemStyle from "../../../style/add-item-style.css";
import style from "./dictionary.style.css";

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
class Dictionary extends React.Component<DictionaryProps, DictionaryState> {
    public static displayName: string = "Dictionary";

    private rootElementRef: React.RefObject<HTMLDivElement> =
        React.createRef<HTMLDivElement>();

    constructor(props: DictionaryProps) {
        super(props);

        this.state = {
            focusedPropertyKey: null,
            focusedPropertyKeyValue: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={"dtc-dictionary"} ref={this.rootElementRef}>
                {this.renderControl()}
                {this.renderControls()}
            </div>
        );
    }

    public componentDidMount(): void {
        this.updateValidity();
    }

    public componentDidUpdate(): void {
        this.updateValidity();
    }

    private updateValidity(): void {
        if (this.props.additionalProperties === false) {
            this.rootElementRef.current
                .querySelectorAll<HTMLInputElement>(
                    `.${"dtc-dictionary_item-control-input dtc-common-input"}`
                )
                .forEach((itemControlInput: HTMLInputElement) => {
                    itemControlInput.setCustomValidity(
                        "should NOT have additional properties"
                    );
                });
        }
    }

    private renderControl(): React.ReactNode {
        if (isPlainObject(this.props.additionalProperties)) {
            return (
                <div
                    className={"dtc-dictionary_control-region dtc-common-control-region"}
                >
                    <div className={"dtc-dictionary_control dtc-common-control"}>
                        <label
                            className={"dtc-dictionary_control-label dtc-common-label"}
                        >
                            {this.props.label}
                        </label>
                    </div>
                    <button
                        className={
                            "dtc-dictionary_control-add-trigger dtc-common-add-item"
                        }
                        aria-label={"Select to add item"}
                        onClick={this.handleOnAddItem}
                    />
                </div>
            );
        }
    }

    private renderItemControl(propertyName: string): React.ReactNode {
        return (
            <div
                className={"dtc-dictionary_item-control-region dtc-common-control-region"}
            >
                <div className={"dtc-dictionary_item-control dtc-common-control"}>
                    <label
                        className={"dtc-dictionary_item-control-label dtc-common-label"}
                    >
                        {this.props.propertyLabel}
                    </label>
                    <input
                        className={"dtc-dictionary_item-control-input dtc-common-input"}
                        type={"text"}
                        value={
                            this.state.focusedPropertyKey === propertyName
                                ? this.state.focusedPropertyKeyValue
                                : propertyName
                        }
                        onFocus={this.handleKeyFocus(propertyName)}
                        onBlur={this.handleKeyBlur(propertyName)}
                        onKeyDown={this.handleKeyPress()}
                        onChange={this.handleKeyChange(propertyName)}
                        readOnly={this.props.additionalProperties === false}
                    />
                    <button
                        className={
                            "dtc-dictionary_item-control-remove-trigger dtc-common-remove-item"
                        }
                        onClick={this.handleOnRemoveItem(propertyName)}
                    />
                </div>
            </div>
        );
    }

    private renderControls(): React.ReactNode {
        return (
            typeof this.props.data !== "undefined" ? Object.keys(this.props.data) : []
        ).reduce(
            (
                accumulator: React.ReactNode,
                currentKey: string,
                index: number
            ): React.ReactNode => {
                if (!this.props.enumeratedProperties.includes(currentKey)) {
                    const dataLocation: string = this.getDataLocation(currentKey);
                    const invalidMessage: string = getErrorFromDataLocation(
                        dataLocation,
                        this.props.validationErrors
                    );

                    return (
                        <React.Fragment key={dataLocation}>
                            {accumulator}
                            <div key={this.props.schemaLocation + index}>
                                {this.renderItemControl(currentKey)}
                                <ControlSwitch
                                    index={index}
                                    controls={this.props.controls}
                                    controlPlugins={this.props.controlPlugins}
                                    controlComponents={this.props.controlComponents}
                                    label={this.props.label}
                                    onChange={this.props.onChange}
                                    propertyName={currentKey}
                                    schemaLocation={this.getSchemaLocation(currentKey)}
                                    dataLocation={dataLocation}
                                    data={this.getData(currentKey)}
                                    schema={this.props.additionalProperties}
                                    disabled={this.props.additionalProperties === false}
                                    onUpdateSection={this.props.onUpdateSection}
                                    required={this.isRequired(currentKey)}
                                    invalidMessage={invalidMessage}
                                    softRemove={false}
                                    displayValidationInline={
                                        this.props.displayValidationInline
                                    }
                                    displayValidationBrowserDefault={
                                        this.props.displayValidationBrowserDefault
                                    }
                                    strings={this.props.strings}
                                    type={this.props.type}
                                    categories={this.props.categories}
                                    untitled={this.props.untitled}
                                    dictionaryId={this.props.dictionaryId}
                                    dataDictionary={this.props.dataDictionary}
                                    navigation={this.props.navigation}
                                    navigationConfigId={this.props.navigationConfigId}
                                    validationErrors={this.props.validationErrors}
                                    schemaDictionary={this.props.schemaDictionary}
                                    messageSystem={this.props.messageSystem}
                                    messageSystemOptions={this.props.messageSystemOptions}
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

    private handleOnAddItem = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const key: string = uniqueId("example");

        if (typeof this.props.default !== "undefined") {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: this.props.default,
            });
        } else if (Array.isArray(this.props.examples) && this.props.examples.length > 0) {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: this.props.examples[0],
            });
        } else {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: generateExampleData(this.props.additionalProperties, ""),
            });
        }
    };

    private handleOnRemoveItem = (
        propertyName: string
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${propertyName}`,
                dictionaryId: this.props.dictionaryId,
                value: void 0,
            });
        };
    };

    private handleKeyPress = (): ((e: React.KeyboardEvent<HTMLInputElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === keyEnter) {
                e.currentTarget.blur();
                e.preventDefault();
            }
        };
    };

    private handleKeyChange = (
        propertyName: string
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKeyValue: e.target.value,
            });
        };
    };

    private handleKeyFocus = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKey: propertyName,
                focusedPropertyKeyValue: propertyName,
            });
        };
    };

    private handleKeyBlur = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            const dataKeys: string[] =
                typeof this.props.data === "undefined"
                    ? []
                    : Object.keys(this.props.data);
            const data: any = {};

            dataKeys.forEach((dataKey: string) => {
                data[dataKey === propertyName ? e.target.value : dataKey] =
                    this.props.data[dataKey];
            });

            this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: data,
            });

            this.setState({
                focusedPropertyKey: null,
                focusedPropertyKeyValue: null,
            });
        };
    };

    private getSchemaLocation(propertyName: string): string {
        return `${
            this.props.schemaLocation === "" ? "" : `${this.props.schemaLocation}.`
        }${PropertyKeyword.additionalProperties}.${propertyName}`;
    }

    private getDataLocation(propertyName: string): string {
        return `${this.props.dataLocation}${
            this.props.dataLocation !== "" ? "." : ""
        }${propertyName}`;
    }

    private getData(propertyName: string): any {
        return this.props.data[propertyName];
    }

    private isRequired(propertyName: string): any {
        return (
            Array.isArray(this.props.required) &&
            this.props.required.includes(propertyName)
        );
    }
}

export { Dictionary };
export default Dictionary;
