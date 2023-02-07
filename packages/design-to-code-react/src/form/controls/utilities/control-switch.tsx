import React from "react";
import { get } from "lodash-es";
import { ControlSwitchProps } from "./control-switch.props";
import {
    AdditionalControlConfigOptions,
    ControlTemplateUtilitiesProps,
    StandardControlPlugin,
} from "../../templates";
import { generateExampleData, isConst, isSelect } from "./form";
import { ItemConstraints } from "design-to-code";
import { SingleLineControlPlugin } from "../../templates/plugin.control.single-line";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "../../templates/plugin.control.utilities";
import { ControlType } from "../../index";
import { dictionaryLink } from "design-to-code";
import { XOR } from "design-to-code/dist/dts/data-utilities/type.utilities";

function ControlSwitch(props: ControlSwitchProps) {
    /**
     * Renders form items
     */
    function renderControl(): React.ReactNode {
        let control: ControlPluginUtilities<ControlPluginUtilitiesProps>;

        // Check to see if there is any associated `controlId`
        // then check for the id within the passed controlPlugins
        if (typeof props.schema.formControlId === "string" && props.controlPlugins) {
            control = props.controlPlugins.find(
                (controlPlugin: StandardControlPlugin) => {
                    return controlPlugin.matchesId(props.schema.formControlId);
                }
            );
        }

        const controlType: XOR<ControlType, null> = getControlType();

        switch (controlType) {
            case ControlType.array:
                return renderArray(
                    control !== undefined ? control : props.controls.array
                );
            case ControlType.button:
                return renderButton(
                    control !== undefined ? control : props.controls.button
                );
            case ControlType.checkbox:
                return renderCheckbox(
                    control !== undefined ? control : props.controls.checkbox
                );
            case ControlType.display:
                return renderDisplay(
                    control !== undefined ? control : props.controls.display
                );
            case ControlType.linkedData:
                return renderDataLink(
                    control !== undefined ? control : props.controls.linkedData
                );
            case ControlType.numberField:
                return renderNumberField(
                    control !== undefined ? control : props.controls.numberField
                );
            case ControlType.section:
            case ControlType.sectionLink:
                return renderSectionLink(
                    control !== undefined ? control : props.controls.sectionLink
                );
            case ControlType.select:
                return renderSelect(
                    control !== undefined ? control : props.controls.select
                );
            case ControlType.textarea:
                return renderTextarea(
                    control !== undefined ? control : props.controls.textarea
                );
        }

        return null;
    }

    function getControlType(): XOR<ControlType, null> {
        if (props.schema === false) {
            return null;
        }

        if (props.schema[dictionaryLink]) {
            return ControlType.linkedData;
        }

        const hasEnum: boolean = isSelect({ enum: props.schema.enum });

        if (isConst(props.schema) || (hasEnum && props.schema.enum.length === 1)) {
            return ControlType.display;
        }

        if (hasEnum) {
            return ControlType.select;
        }

        if (props.schema.oneOf || props.schema.anyOf) {
            return ControlType.sectionLink;
        }

        switch (props.schema.type) {
            case "boolean":
                return ControlType.checkbox;
            case "number":
                return ControlType.numberField;
            case "string":
                return ControlType.textarea;
            case "array":
                return ControlType.array;
            case "null":
                return ControlType.button;
            default:
                return ControlType.sectionLink;
        }
    }

    function renderDataLink(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(getCommonControlProps(ControlType.linkedData));

        return control.render();
    }

    /**
     * Renders the array form item
     */
    function renderArray(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(getCommonControlProps(ControlType.array), {
                minItems: get(props.schema, ItemConstraints.minItems, 0),
                maxItems: get(props.schema, ItemConstraints.maxItems, Infinity),
                onAddExampleData: handleAddExampleData,
            })
        );

        return control.render();
    }

    /**
     * Renders the number field form item
     */
    function renderNumberField(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(getCommonControlProps(ControlType.numberField), {
                min: props.schema.minimum,
                max: props.schema.maximum,
                step: props.schema.multipleOf,
            })
        );

        return control.render();
    }

    /**
     * Renders the checkbox form item
     */
    function renderCheckbox(control: SingleLineControlPlugin): React.ReactNode {
        control.updateProps(getCommonControlProps(ControlType.checkbox));

        return control.render();
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    function renderSectionLink(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(getCommonControlProps(ControlType.sectionLink));

        return control.render();
    }

    /**
     * Renders the textarea form item
     */
    function renderTextarea(control: StandardControlPlugin): React.ReactNode {
        const rows: number | undefined = props.schema.rows || void 0;

        control.updateProps(
            Object.assign(getCommonControlProps(ControlType.textarea), {
                rows,
            })
        );

        return control.render();
    }

    /**
     * Renders the select form item
     */
    function renderSelect(control: StandardControlPlugin): React.ReactNode {
        const options: any[] = props.schema.enum || [];

        if (!props.required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        control.updateProps(
            Object.assign(getCommonControlProps(ControlType.select), {
                options,
            })
        );

        return control.render();
    }

    /**
     * Renders the display form item
     */
    function renderDisplay(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(getCommonControlProps(ControlType.display));

        return control.render();
    }

    function renderButton(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(getCommonControlProps(ControlType.button));

        return control.render();
    }

    function handleAddExampleData(additionalSchemaPathSyntax: string): any {
        return generateExampleData(props.schema, additionalSchemaPathSyntax);
    }

    /**
     * Gets the common form control props
     */
    function getCommonControlProps(
        type: ControlType
    ): ControlTemplateUtilitiesProps & AdditionalControlConfigOptions {
        const schema: any = get(props, "schema", {});

        return {
            index: props.index,
            type,
            dataLocation: props.dataLocation,
            navigationConfigId: props.navigationConfigId,
            dictionaryId: props.dictionaryId,
            dataDictionary: props.dataDictionary,
            navigation: props.navigation,
            schemaLocation: props.schemaLocation,
            data: props.data,
            schemaDictionary: props.schemaDictionary,
            schema,
            required: props.required,
            label: schema.title || schema.description || props.untitled,
            labelTooltip: schema.description,
            disabled: props.disabled || schema.disabled,
            onChange: props.onChange,
            default:
                typeof schema.default !== "undefined"
                    ? schema.default
                    : typeof props.default !== "undefined"
                    ? props.default
                    : void 0,
            const: schema.const || props.const,
            badge: schema.badge,
            badgeDescription: schema.badgeDescription,
            invalidMessage: props.invalidMessage,
            validationErrors: props.validationErrors,
            displayValidationBrowserDefault: props.displayValidationBrowserDefault,
            displayValidationInline: props.displayValidationInline,
            onUpdateSection: props.onUpdateSection,
            softRemove: shouldBeSoftRemovable(type),
            component: props.controlComponents[type],
            controls: props.controls,
            controlComponents: props.controlComponents,
            controlPlugins: props.controlPlugins,
            untitled: props.untitled,
            messageSystem: props.messageSystem,
            strings: props.strings,
            messageSystemOptions: props.messageSystemOptions,
            categories: props.categories,
        };
    }

    /**
     * Determine whether this control can be soft-removed
     * which allows undo/redo for the last stored value
     */
    function shouldBeSoftRemovable(type: ControlType): boolean {
        return ![
            ControlType.button,
            ControlType.checkbox,
            ControlType.display,
            ControlType.select,
        ].includes(type);
    }

    return <React.Fragment>{renderControl()}</React.Fragment>;
}

export default ControlSwitch;
export { ControlSwitchProps };
