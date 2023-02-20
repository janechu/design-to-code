/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
import React from "react";
import {
    RenderRefControlConfig,
    RenderSelectControlConfig,
} from "./control.css.utilities.props";

export function renderDefault(config: RenderRefControlConfig): JSX.Element {
    return renderTextInput(config);
}

function getInputChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    let timer: null | NodeJS.Timer = null;

    const handleCheck = (newValue: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(e.currentTarget.value);
    };
}

// TODO: is there a better way to retrieve design system context and use the tagFor?
// this is currently an experimental component however this should be adjusted before
// documentation and export

export function renderTextInput(config: RenderRefControlConfig): JSX.Element {
    return (
        <input
            type={"text"}
            className={"dtc-textarea-control"}
            {...{
                key: `${config.dictionaryId}::${config.dataLocation}`,
                events: {
                    input: getInputChangeHandler(config.handleChange),
                },
                ...(config.value
                    ? {
                          value: config.value,
                      }
                    : {}),
            }}
        />
    );
}

export function renderNumber(config: RenderRefControlConfig): JSX.Element {
    return (
        <input
            type={"number"}
            className={"dtc-number-field-control dtc-common-input"}
            {...{
                key: `${config.dictionaryId}::${config.dataLocation}`,
                events: {
                    input: getInputChangeHandler(config.handleChange),
                },
                ...(config.value
                    ? {
                          value: config.value,
                      }
                    : {}),
            }}
        />
    );
}

export function renderInteger(config: RenderRefControlConfig): JSX.Element {
    return (
        <input
            type={"number"}
            className={"dtc-number-field-control dtc-common-input"}
            {...{
                key: `${config.dictionaryId}::${config.dataLocation}`,
                events: {
                    input: getInputChangeHandler(config.handleChange),
                },
                step: 1,
                ...(config.value
                    ? {
                          value: config.value,
                      }
                    : {}),
            }}
        />
    );
}

function getCheckboxInputChangeHandler(
    parentChangeHandler: (value: string) => void,
    value: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        parentChangeHandler(e.currentTarget.checked ? value : "");
    };
}

export function renderCheckbox(config: RenderRefControlConfig): JSX.Element {
    return (
        <React.Fragment>
            <input
                type={"checkbox"}
                className={"dtc-checkbox-control"}
                {...{
                    events: {
                        change: getCheckboxInputChangeHandler(
                            config.handleChange,
                            config.ref.ref as string
                        ),
                    },
                    ...(config.value
                        ? {
                              value: config.value,
                          }
                        : {}),
                }}
            />
            <span className={"dtc-checkbox-control_checkmark"} />
            <label>{config.ref.ref}</label>
        </React.Fragment>
    );
}

function getSelectionChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLSelectElement>) => void {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
        parentChangeHandler(e.currentTarget.value);
    };
}

export function renderSelection(config: RenderSelectControlConfig): JSX.Element {
    const currentOption = config.options.find(
        option => option.displayName === config.value
    );
    const currentValue = currentOption ? `${currentOption.value}` : "";

    return (
        <span className="dtc-common-select-span">
            <select
                className={"dtc-select-control_input dtc-common-select-input"}
                key={`${config.dictionaryId}::${config.dataLocation}`}
                onChange={getSelectionChangeHandler(config.handleChange)}
            >
                {config.options.map(option => {
                    return (
                        <option
                            {...{
                                value: `${option.value}`,
                                key: `${config.dictionaryId}::${config.dataLocation}::${option.key}`,
                                ...(`${option.value}` === currentValue
                                    ? {
                                          selected: true,
                                      }
                                    : {}),
                            }}
                        >
                            {option.displayName}
                        </option>
                    );
                })}
            </select>
        </span>
    );
}

function getColorPickerChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    let timer: null | NodeJS.Timer = null;

    const handleCheck = (newValue: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(e.currentTarget.value);
    };
}

export function renderColorPicker(config: RenderRefControlConfig): JSX.Element {
    return (
        <dtc-color-picker
            key={`${config.dictionaryId}::${config.dataLocation}`}
            value={config.value}
            events={{
                change: getColorPickerChangeHandler(config.handleChange),
            }}
            control-text-field-stylesheet={config.stylesheets.controlTextFieldStylesheet}
            common-input-stylesheet={config.stylesheets.commonInputStylesheet}
            common-default-font-stylesheet={
                config.stylesheets.commonDefaultFontStylesheet
            }
        ></dtc-color-picker>
    );
}
