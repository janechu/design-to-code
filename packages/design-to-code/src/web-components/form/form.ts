import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    DataDictionary,
    dataSetName,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
    NavigationConfigDictionary,
    Register,
    SchemaDictionary,
    TreeNavigation,
    TreeNavigationItem,
    Validation,
} from "../../index.js";

export const formId: string = "dtc-react::form";

interface FormRegisterConfig {
    displayTextDataLocation: string;
}

export class Form extends FASTElement {
    @attr({ attribute: "array-control" })
    arrayControl: string;

    @attr({ attribute: "button-control" })
    buttonControl: string;

    @attr({ attribute: "checkbox-control" })
    checkboxControl: string;

    @attr({ attribute: "display-control" })
    displayControl: string;

    @attr({ attribute: "number-field-control" })
    numberFieldControl: string;

    @attr({ attribute: "section-link-control" })
    sectionLinkControl: string;

    @attr({ attribute: "select-control" })
    selectControl: string;

    @attr({ attribute: "textarea-control" })
    textareaControl: string;

    @observable messageSystem: MessageSystem;
    messageSystemChanged(
        oldMessageSystem: MessageSystem,
        newMessageSystem: MessageSystem
    ) {
        if (newMessageSystem !== undefined) {
            newMessageSystem.add(this.messageSystemConfig);
        }
    }

    public schemaDictionary: SchemaDictionary = {};
    public dataDictionary: DataDictionary<unknown> = [{}, ""];
    public activeNavigationConfigId: string;

    @observable
    public navigationDictionary: NavigationConfigDictionary;
    navigationDictionaryChanged(
        oldValue: void | NavigationConfigDictionary,
        newValue: NavigationConfigDictionary
    ) {
        this.navigationItem =
            newValue[0][this.activeDictionaryId][0][this.activeNavigationConfigId];
        this.navigation = this.navigationDictionary[0][this.activeDictionaryId][0];
    }

    @observable
    public navigationItem: TreeNavigationItem;

    @observable
    public navigation: TreeNavigation;

    public validationErrors: Validation;
    public options: Array<unknown>;
    public data: any;

    private activeDictionaryId: string = "";

    public handleMessageSystem = (e: MessageEvent) => {
        let setState = false;
        let updatedActiveDictionaryId: string = e.data.activeDictionaryId;

        switch (e.data.type) {
            case MessageSystemType.initialize:
            case MessageSystemType.data:
                updatedActiveDictionaryId = e.data?.activeDictionaryId
                    ? e.data.activeDictionaryId
                    : this.activeDictionaryId;
            case MessageSystemType.navigation:
            case MessageSystemType.validation:
            case MessageSystemType.schemaDictionary:
                setState = true;
                break;
        }

        if (setState) {
            const updatedSchemaDictionary: SchemaDictionary = e.data.schemaDictionary;
            const updatedDataDictionary: DataDictionary<unknown> = e.data.dataDictionary;
            const updatedNavigationDictionary: NavigationConfigDictionary =
                e.data.navigationDictionary;
            const updatedActiveDictionaryId: string = e.data.activeDictionaryId;
            const updatedActiveNavigationConfigId: string =
                e.data.activeNavigationConfigId;
            const updatedValidationErrors: Validation = e.data.validation;
            const updatedData: any =
                updatedDataDictionary[0][updatedActiveDictionaryId].data;
            const updatedOptions = e.data.options;

            this.schemaDictionary = updatedSchemaDictionary;
            this.dataDictionary = updatedDataDictionary;
            this.activeDictionaryId = updatedActiveDictionaryId;
            this.activeNavigationConfigId = updatedActiveNavigationConfigId;
            this.navigationDictionary = updatedNavigationDictionary;
            this.validationErrors = updatedValidationErrors;
            this.options = updatedOptions;
            this.data = updatedData;
        }
    };

    private messageSystemConfig: Register<FormRegisterConfig> = {
        onMessage: this.handleMessageSystem,
        config: {
            displayTextDataLocation: dataSetName,
        },
    };

    /**
     * Fast Element lifecycle hook
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener("change", this.handleOnChange);
    }

    /**
     * Fast Element lifecycle hook
     */
    public disconnectedCallback(): void {
        super.connectedCallback();

        if (this.messageSystem !== undefined) {
            this.messageSystem.remove(this.messageSystemConfig);
        }

        this.removeEventListener("change", this.handleOnChange);
    }

    private handleOnChange(e: Event): void {
        const control = e.composedPath()[0] as HTMLInputElement;

        if (this.messageSystem) {
            this.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: control.getAttribute("data-location"),
                data: control.value,
                options: {
                    originatorId: formId,
                },
            });
        }
    }
}
