import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    LinkedDataControl,
    NumberFieldControl,
    SectionControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
    DateControl,
    TimeControl,
    DateTimeControl,
    EmailControl,
    UntypedControl,
} from "./controls";
import {
    BareControlPlugin,
    ControlConfig,
    ControlType,
    StandardControlPlugin,
} from "./templates";
import { ControlContext, LinkedDataActionType, OnChangeConfig } from "./templates/types";
import { BreadcrumbItem, getDictionaryBreadcrumbs } from "./utilities";
import {
    BreadcrumbItemEventHandler,
    ControlPluginConfig,
    FormProps,
    FormStrings,
} from "./form.props";
import { cloneDeep, get } from "lodash-es";
import React, { useEffect, useState } from "react";
import defaultStrings from "./form.strings";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    DataDictionary,
    dataSetName,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    NavigationConfigDictionary,
    Register,
    SchemaDictionary,
    TreeNavigationItem,
    Validation,
} from "design-to-code";
import cleanListStyle from "design-to-code/dist/stylesheets/web-components/style/common.clean-list.css";
import style from "./form.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

// tree-shaking
cleanListStyle;
style;

export const formId: string = "dtc-react::form";

interface FormRegisterConfig {
    displayTextDataLocation: string;
}

/**
 * Schema form component definition
 */
const Form: React.FC<FormProps> = (
    props: Partial<FormProps> = {
        controls: [],
        displayValidationBrowserDefault: true,
    }
) => {
    /**
     * The default untitled string
     */
    const untitled: string = "Untitled";

    /**
     * The default form controls
     */
    let selectControl: StandardControlPlugin;
    let displayControl: StandardControlPlugin;
    let linkedDataControl: StandardControlPlugin;
    let sectionLinkControl: StandardControlPlugin;
    let sectionControl: BareControlPlugin;
    let checkboxControl: StandardControlPlugin;
    let numberFieldControl: StandardControlPlugin;
    let textareaControl: StandardControlPlugin;
    let arrayControl: StandardControlPlugin;
    let buttonControl: StandardControlPlugin;
    let dateControl: StandardControlPlugin;
    let timeControl: StandardControlPlugin;
    let dateTimeControl: StandardControlPlugin;
    let emailControl: StandardControlPlugin;
    let untypedControl: StandardControlPlugin;

    /**
     * The default form components as a dictionary
     * by type
     */
    const controlComponents: {
        [key: string]: React.ComponentClass | React.FunctionComponent;
    } = {};

    let strings: FormStrings = !!props.strings ? props.strings : defaultStrings;

    updateControls();

    const [activeDictionaryId, setActiveDictionaryId] = useState("");
    const [activeNavigationConfigId, setActiveNavigationConfigId] = useState("");
    const [data, setData] = useState(void 0);
    const [dataDictionary, setDataDictionary] = useState(void 0);
    const [schemaDictionary, setSchemaDictionary] = useState({});
    const [navigationDictionary, setNavigationDictionary] = useState(void 0);
    const [validationErrors, setValidationErrors] = useState({});
    const [options, setOptions] = useState(null);

    useEffect(() => {
        const messageSystemConfig: Register<FormRegisterConfig> = {
            onMessage: handleMessageSystem,
            config: {
                displayTextDataLocation: dataSetName,
            },
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(messageSystemConfig);
        }

        return function cancel() {
            if (props.messageSystem !== undefined) {
                props.messageSystem.remove(messageSystemConfig);
            }
        };
    });

    function renderForm(): React.ReactNode {
        return navigationDictionary ? (
            <form onSubmit={handleSubmit}>
                {renderBreadcrumbs()}
                {renderSection()}
            </form>
        ) : null;
    }

    /**
     * Handle messages from the message system
     */
    function handleMessageSystem(e: MessageEvent): void {
        let setState = false;
        let updatedActiveDictionaryId: string = e.data.activeDictionaryId;

        switch (e.data.type) {
            case MessageSystemType.initialize:
            case MessageSystemType.data:
                updatedActiveDictionaryId = e.data?.activeDictionaryId
                    ? e.data.activeDictionaryId
                    : activeDictionaryId;
            case MessageSystemType.navigation:
            case MessageSystemType.validation:
            case MessageSystemType.schemaDictionary:
                setState = true;
                break;
        }

        if (setState) {
            const updatedSchemaDictionary: SchemaDictionary = e.data.schemaDictionary;
            let updatedDataDictionary: DataDictionary<unknown> = e.data.dataDictionary;
            let updatedNavigationDictionary: NavigationConfigDictionary =
                e.data.navigationDictionary;
            let updatedActiveDictionaryId: string = e.data.activeDictionaryId;
            let updatedActiveNavigationConfigId: string = e.data.activeNavigationConfigId;
            let updatedValidationErrors: Validation = e.data.validation;
            let updatedData: any =
                updatedDataDictionary[0][updatedActiveDictionaryId].data;
            let updatedOptions = e.data.options;

            setSchemaDictionary(updatedSchemaDictionary);
            setDataDictionary(updatedDataDictionary);
            setActiveDictionaryId(updatedActiveDictionaryId);
            setActiveNavigationConfigId(updatedActiveNavigationConfigId);
            setNavigationDictionary(updatedNavigationDictionary);
            setValidationErrors(updatedValidationErrors);
            setOptions(updatedOptions);
            setData(updatedData);
        }
    }

    /**
     * Find all type controls passed and use them in
     * place of the default controls
     */
    function findControlPlugin(
        hasCustomControlPlugins: boolean,
        type: ControlType
    ): StandardControlPlugin {
        const controlPluginConfig: ControlPluginConfig = getComponentByType(type);

        if (hasCustomControlPlugins) {
            const controlPlugin: StandardControlPlugin = props.controls.find(
                (control: StandardControlPlugin): boolean => {
                    return control.matchesType(type);
                }
            );

            if (controlPlugin !== undefined) {
                controlComponents[type] =
                    controlPlugin.config.component !== undefined
                        ? controlPlugin.config.component
                        : controlPluginConfig.component;

                return controlPlugin;
            }

            const allControlsPlugin: StandardControlPlugin = props.controls.find(
                (control: StandardControlPlugin): boolean => {
                    return control.matchesAllTypes();
                }
            );

            if (allControlsPlugin !== undefined) {
                controlComponents[type] =
                    allControlsPlugin.config.component !== undefined
                        ? allControlsPlugin.config.component
                        : controlPluginConfig.component;

                return allControlsPlugin;
            }
        }

        const ControlComponent = controlPluginConfig.component as React.ComponentClass;
        controlComponents[type] = ControlComponent;

        return new controlPluginConfig.plugin({
            ...controlPluginConfig,
            type,
            control: (config: ControlConfig): React.ReactNode => {
                return <ControlComponent {...config} />;
            },
        });
    }

    function getComponentByType(type: ControlType): ControlPluginConfig {
        switch (type) {
            case ControlType.select:
                return {
                    plugin: StandardControlPlugin,
                    component: SelectControl,
                    context: ControlContext.fill,
                };
            case ControlType.array:
                return {
                    plugin: StandardControlPlugin,
                    component: ArrayControl,
                    context: ControlContext.fill,
                };
            case ControlType.linkedData:
                return {
                    plugin: StandardControlPlugin,
                    component: LinkedDataControl,
                    context: ControlContext.fill,
                };
            case ControlType.numberField:
                return {
                    plugin: StandardControlPlugin,
                    component: NumberFieldControl,
                    context: ControlContext.fill,
                };
            case ControlType.checkboxOrRadios:
                return {
                    plugin: StandardControlPlugin,
                    component: CheckboxControl,
                    context: ControlContext.default,
                };
            case ControlType.sectionLink:
                return {
                    plugin: StandardControlPlugin,
                    component: SectionLinkControl,
                    context: ControlContext.fill,
                };
            case ControlType.textarea:
                return {
                    plugin: StandardControlPlugin,
                    component: TextareaControl,
                    context: ControlContext.fill,
                };
            case ControlType.display:
                return {
                    plugin: StandardControlPlugin,
                    component: DisplayControl,
                    context: ControlContext.fill,
                };
            case ControlType.button:
                return {
                    plugin: StandardControlPlugin,
                    component: ButtonControl,
                    context: ControlContext.fill,
                };
            case ControlType.date:
                return {
                    plugin: StandardControlPlugin,
                    component: DateControl,
                    context: ControlContext.fill,
                };
            case ControlType.time:
                return {
                    plugin: StandardControlPlugin,
                    component: TimeControl,
                    context: ControlContext.fill,
                };
            case ControlType.dateTime:
                return {
                    plugin: StandardControlPlugin,
                    component: DateTimeControl,
                    context: ControlContext.fill,
                };
            case ControlType.email:
                return {
                    plugin: StandardControlPlugin,
                    component: EmailControl,
                    context: ControlContext.fill,
                };
            case ControlType.section:
                return {
                    plugin: BareControlPlugin,
                    component: SectionControl,
                    context: ControlContext.default,
                };
            default:
                return {
                    plugin: StandardControlPlugin,
                    component: UntypedControl,
                    context: ControlContext.default,
                };
        }
    }

    function updateControls(): void {
        const hasCustomControlPlugins: boolean = Array.isArray(props.controls);

        selectControl = findControlPlugin(hasCustomControlPlugins, ControlType.select);
        arrayControl = findControlPlugin(hasCustomControlPlugins, ControlType.array);
        linkedDataControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.linkedData
        );
        numberFieldControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.numberField
        );
        checkboxControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.checkboxOrRadios
        );
        sectionLinkControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.sectionLink
        );
        textareaControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.textarea
        );
        displayControl = findControlPlugin(hasCustomControlPlugins, ControlType.display);
        buttonControl = findControlPlugin(hasCustomControlPlugins, ControlType.button);
        sectionControl = findControlPlugin(hasCustomControlPlugins, ControlType.section);
        dateControl = findControlPlugin(hasCustomControlPlugins, ControlType.date);
        timeControl = findControlPlugin(hasCustomControlPlugins, ControlType.time);
        dateTimeControl = findControlPlugin(
            hasCustomControlPlugins,
            ControlType.dateTime
        );
        emailControl = findControlPlugin(hasCustomControlPlugins, ControlType.email);
        untypedControl = findControlPlugin(hasCustomControlPlugins, ControlType.untyped);
    }

    /**
     * Generates the breadcrumb navigation
     */
    function renderBreadcrumbs(): JSX.Element {
        const breadcrumbs: BreadcrumbItem[] = getDictionaryBreadcrumbs(
            navigationDictionary,
            activeDictionaryId,
            activeNavigationConfigId,
            handleBreadcrumbClick,
            untitled
        );

        if (breadcrumbs.length > 1) {
            return (
                <ul className={`dtc-form_breadcrumbs ${dtcClassName.commonCleanList}`}>
                    {renderBreadcrumbItems(breadcrumbs)}
                </ul>
            );
        }
    }

    function renderBreadcrumbItems(items: BreadcrumbItem[]): React.ReactNode {
        return items.map((item: BreadcrumbItem, index: number): JSX.Element => {
            if (index === items.length - 1) {
                return (
                    <li key={index}>
                        <span>{item.text || untitled}</span>
                    </li>
                );
            }

            return (
                <li key={index}>
                    <a href={item.href} onClick={item.onClick}>
                        {item.text || untitled}
                    </a>
                </li>
            );
        });
    }

    /**
     * Render the section to be shown
     */
    function renderSection(): React.ReactNode {
        let control: BareControlPlugin = sectionControl;
        const navigationItem: TreeNavigationItem =
            navigationDictionary[0][activeDictionaryId][0][activeNavigationConfigId];

        // Check to see if there is any associated `formControlId`
        // then check for the id within the passed controlPlugins
        if (typeof get(navigationItem, `schema.formControlId`) === "string") {
            control = props.controls.find((controlPlugin: StandardControlPlugin) => {
                return controlPlugin.matchesId(
                    (navigationItem.schema as any).formControlId
                );
            });

            if (control === undefined) {
                control = sectionControl;
            }
        }

        control.updateProps({
            index: 0,
            type: ControlType.section,
            required: false,
            label: navigationItem.text || untitled,
            invalidMessage: "",
            component: controlComponents[ControlType.section],
            schema: navigationItem.schema,
            schemaDictionary,
            controls: {
                button: buttonControl,
                array: arrayControl,
                linkedData: linkedDataControl,
                checkbox: checkboxControl,
                display: displayControl,
                textarea: textareaControl,
                select: selectControl,
                section: sectionControl,
                sectionLink: sectionLinkControl,
                numberField: numberFieldControl,
                date: dateControl,
                time: timeControl,
                dateTime: dateTimeControl,
                email: emailControl,
                untyped: untypedControl,
            },
            controlPlugins: props.controls,
            controlComponents: controlComponents,
            onChange: handleOnChange,
            onUpdateSection: handleUpdateActiveSection,
            data: navigationItem.data,
            schemaLocation: navigationItem.schemaLocation,
            default: get(navigationItem, "schema.default"),
            disabled: navigationItem.disabled,
            dataLocation:
                navigationDictionary[0][activeDictionaryId][0][navigationItem.self]
                    .relativeDataLocation,
            navigationConfigId: navigationItem.self,
            dictionaryId: activeDictionaryId,
            dataDictionary: dataDictionary,
            navigation: navigationDictionary[0][activeDictionaryId][0],
            untitled: untitled,
            validationErrors: validationErrors[activeDictionaryId],
            displayValidationBrowserDefault: props.displayValidationBrowserDefault,
            displayValidationInline: props.displayValidationInline,
            displayValidationErrorList: props.displayValidationErrorList,
            messageSystem: props.messageSystem,
            strings: strings,
            messageSystemOptions: options,
            categories: props.categories || {},
            validate: props.showValidation,
        });

        return control.render();
    }

    function handleBreadcrumbClick(
        dictionaryId: string,
        navigationConfigId: string
    ): BreadcrumbItemEventHandler {
        return (e: React.MouseEvent): void => {
            e.preventDefault();

            handleUpdateActiveSection(dictionaryId, navigationConfigId);
        };
    }

    function handleOnChange(config: OnChangeConfig): void {
        if (props.messageSystem) {
            if (config.isLinkedData) {
                if (config.linkedDataAction === LinkedDataActionType.add) {
                    props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                        options: {
                            originatorId: formId,
                        },
                    });
                } else if (config.linkedDataAction === LinkedDataActionType.reorder) {
                    props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.reorderLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                        options: {
                            originatorId: formId,
                        },
                    });
                } else if (config.linkedDataAction === LinkedDataActionType.remove) {
                    props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                        options: {
                            originatorId: formId,
                        },
                    });
                }
            } else if (config.isArray) {
                const updatedData: any[] =
                    config.dataLocation === ""
                        ? cloneDeep(data)
                        : cloneDeep(get(data, config.dataLocation)) || [];
                let newArray: any[];

                if (typeof config.index !== "undefined") {
                    newArray = updatedData.filter((item: any, itemIndex: number) => {
                        return itemIndex !== config.index;
                    });
                } else {
                    newArray = updatedData;
                    newArray.push(config.value);
                }

                props.messageSystem.postMessage({
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.update,
                    dataLocation: config.dataLocation,
                    data: newArray,
                    options: {
                        originatorId: formId,
                    },
                });
            } else {
                if (config.value === undefined) {
                    props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.remove,
                        dataLocation: config.dataLocation,
                        options: {
                            originatorId: formId,
                        },
                    });
                } else {
                    props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dataLocation: config.dataLocation,
                        data: config.value,
                        options: {
                            originatorId: formId,
                        },
                    });
                }
            }
        }
    }

    /**
     * Handles the form submit
     */
    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
    }

    /**
     * Handles an update to the active section and component
     */
    function handleUpdateActiveSection(
        dictionaryId: string,
        navigationConfigId?: string
    ): void {
        if (props.messageSystem) {
            props.messageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeNavigationConfigId:
                    navigationConfigId !== undefined
                        ? navigationConfigId
                        : navigationDictionary[0][dictionaryId][1],
                activeDictionaryId: dictionaryId,
                options: {
                    originatorId: formId,
                },
            });
        }
    }

    return <div className={classNames("dtc-form")}>{renderForm()}</div>;
};

export default Form;
