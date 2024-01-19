import React from "react";
import { isEqual } from "lodash-es";
import Badge from "./badge";
import DefaultValue from "./default-value";
import ConstValue from "./const-value";
import Remove from "./remove";
import {
    ControlConfig,
    FormHTMLElement,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";
import { BadgeType, ControlType, OnChangeConfig } from "./types";
import { FormStrings } from "../form.props";

/**
 * Custom templates can make use of the available utility functions
 */

export interface RenderRemoveProps {
    className: string;
    required: boolean;
    remove?: boolean;
    type: ControlType;
    disabled?: boolean;
    data: boolean;
    dataLocation: string;
    dictionaryId: string;
    onChange: (config: OnChangeConfig) => void;
}

export function renderRemove(props: RenderRemoveProps): JSX.Element {
    if (
        !props.required &&
        props.remove &&
        props.data !== undefined &&
        props.type !== ControlType.linkedData
    ) {
        return (
            <Remove
                className={props.className}
                onChange={handleRemove(props)}
                disabled={props.disabled && props.data === undefined}
            />
        );
    }
}

export interface RenderBadgeProps {
    className: string;
    badge?: BadgeType;
    badgeDescription?: string;
}

export function renderBadge(props: RenderBadgeProps): React.ReactNode {
    if (props.badge) {
        return (
            <Badge
                className={props.className}
                type={props.badge}
                description={props.badgeDescription}
            />
        );
    }
}

export interface RenderConstValueIndicatorProps {
    const?: boolean;
    data: any;
    className: string;
    disabled?: boolean;
    strings: FormStrings;
    dataLocation: string;
    dictionaryId: string;
    onChange: (config: OnChangeConfig) => void;
}

export function renderConstValueIndicator(
    props: RenderConstValueIndicatorProps
): React.ReactNode {
    if (props.const !== undefined && props.data !== props.const) {
        return (
            <ConstValue
                className={props.className}
                disabled={props.disabled}
                onChange={handleSetConstValue(props)}
                strings={props.strings}
            />
        );
    }
}

export interface RenderDefaultValueIndicatorProps {
    default?: any;
    data: any;
    className: string;
    disabled?: boolean;
    strings: FormStrings;
    dataLocation: string;
    dictionaryId: string;
    onChange: (config: OnChangeConfig) => void;
}

/**
 * Renders an indicator that signifies that the value
 * displayed is a default value
 */
export function renderDefaultValueIndicator(
    props: RenderDefaultValueIndicatorProps
): React.ReactNode {
    if (typeof props.default !== "undefined" && !isEqual(props.data, props.default)) {
        return (
            <DefaultValue
                className={props.className}
                disabled={props.disabled}
                onChange={handleSetDefaultValue(props)}
                strings={props.strings}
            />
        );
    }
}

export interface HandleChangeProps {
    onChange: (config: OnChangeConfig) => void;
    dataLocation: string;
    dictionaryId: string;
}

export function handleChange(props: HandleChangeProps): (config: OnChangeConfig) => void {
    return (config: OnChangeConfig): void => {
        props.onChange({
            dataLocation: props.dataLocation,
            dictionaryId: props.dictionaryId,
            value: config.value,
            isArray: config.isArray,
            isLinkedData: config.isLinkedData,
            linkedDataAction: config.linkedDataAction,
            index: config.index,
        });
    };
}

export interface HandleSetDefaultValueProps {
    onChange: (config: OnChangeConfig) => void;
    dataLocation: string;
    dictionaryId: string;
    default?: any;
}

export function handleSetDefaultValue(props: HandleSetDefaultValueProps): () => void {
    return function (): void {
        props.onChange({
            dataLocation: props.dataLocation,
            dictionaryId: props.dictionaryId,
            value: props.default,
        });
    };
}

export interface HandleSetConstValueProps {
    onChange: (config: OnChangeConfig) => void;
    dataLocation: string;
    dictionaryId: string;
    const?: any;
}

export function handleSetConstValue(props: HandleSetConstValueProps): () => void {
    return function (): void {
        props.onChange({
            dataLocation: props.dataLocation,
            dictionaryId: props.dictionaryId,
            value: props.const,
        });
    };
}

export interface HandleRemoveProps {
    onChange: (config: OnChangeConfig) => void;
    dataLocation: string;
    dictionaryId: string;
    data: any;
}

function handleRemove(props: HandleRemoveProps): () => void {
    return function (): void {
        return props.onChange({
            dataLocation: props.dataLocation,
            dictionaryId: props.dictionaryId,
            value: undefined,
        });
    };
}

export interface RenderInvalidMessageProps {
    className: string;
    invalidMessage: string;
    displayValidationInline?: boolean;
}

/**
 * Renders an invalid message
 */
export function renderInvalidMessage(props: RenderInvalidMessageProps): React.ReactNode {
    if (props.invalidMessage !== "" && props.displayValidationInline) {
        return <div className={props.className}>{props.invalidMessage}</div>;
    }
}

export interface RenderRequiredProps {
    required: boolean;
    className: string;
}

/**
 * Renders an indicator that a field is required
 */
export function renderRequired(props: RenderRequiredProps): React.ReactNode {
    return props.required ? <span className={props.className}>(required)</span> : null;
}

export interface UpdateValidityProps {
    ref: React.MutableRefObject<FormHTMLElement>;
    invalidMessage: string;
}

/**
 * updates the validity
 *
 * Use:
 * useEffect(() => {
 *    updateValidity();
 * });
 */
export function updateValidity(
    props: UpdateValidityProps
): (refs?: React.RefObject<HTMLInputElement>[]) => void {
    return function (refs?: React.RefObject<HTMLInputElement>[]): void {
        const formControlElement: HTMLElement = props.ref.current;

        if (formControlElement !== null && typeof formControlElement !== "undefined") {
            props.ref.current.setCustomValidity(props.invalidMessage);
        }

        if (Array.isArray(refs)) {
            refs.forEach(ref => {
                ref.current.setCustomValidity(props.invalidMessage);
            });
        }
    };
}

export interface ReportValidityProps {
    ref: React.MutableRefObject<FormHTMLElement>;
    invalidMessage: string;
    displayValidationBrowserDefault?: boolean;
}

/**
 * Reports the current validity of the form item
 */
function reportValidity(props: ReportValidityProps): () => void {
    return function (): void {
        updateValidity(props);

        if (props.displayValidationBrowserDefault) {
            props.ref.current.reportValidity();
        }
    };
}

export interface GetConfigProps extends ControlTemplateUtilitiesProps {
    /**
     * The form element React ref
     */
    ref: React.MutableRefObject<null>;
}

export function getConfig(props: GetConfigProps): ControlConfig {
    return {
        type: props.type,
        schemaDictionary: props.schemaDictionary,
        dataLocation: props.dataLocation,
        navigationConfigId: props.navigationConfigId,
        dictionaryId: props.dictionaryId,
        dataDictionary: props.dataDictionary,
        navigation: props.navigation,
        schemaLocation: props.schemaLocation,
        disabled: props.disabled,
        value: props.data,
        schema: props.schema,
        elementRef: props.ref,
        reportValidity: reportValidity(props),
        updateValidity: updateValidity(props),
        onChange:
            props.type === ControlType.section ? props.onChange : handleChange(props),
        min: props.min,
        max: props.max,
        step: props.step,
        rows: props.rows,
        options: props.options,
        label: props.label,
        onUpdateSection: props.onUpdateSection,
        invalidMessage: props.invalidMessage,
        validationErrors: props.validationErrors,
        displayValidationBrowserDefault: props.displayValidationBrowserDefault,
        displayValidationInline: props.displayValidationInline,
        displayValidationErrorList: props.displayValidationErrorList,
        minItems: props.minItems,
        maxItems: props.maxItems,
        onAddExampleData: props.onAddExampleData,
        default: props.default,
        component: props.component,
        required: props.required,
        controls: props.controls,
        controlComponents: props.controlComponents,
        controlPlugins: props.controlPlugins,
        untitled: props.untitled,
        messageSystem: props.messageSystem,
        strings: props.strings,
        messageSystemOptions: props.messageSystemOptions,
        categories: props.categories,
        validate: props.validate,
    };
}

export interface HandleUpdateValueToDefaultValueProps {
    onChange: (config: OnChangeConfig) => void;
    dataLocation: string;
    dictionaryId: string;
    default: any;
}

/**
 * Explicitly updates the default value as the value
 */
export function handleUpdateValueToDefaultValue(
    props: HandleUpdateValueToDefaultValueProps
): () => void {
    return function (): void {
        props.onChange({
            dataLocation: props.dataLocation,
            dictionaryId: props.dictionaryId,
            value: props.default,
        });
    };
}
