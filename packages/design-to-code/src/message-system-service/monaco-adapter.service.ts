import { IPosition } from "monaco-editor";
import {
    InitializeMessageIncoming,
    MessageSystemType,
    SchemaDictionary,
} from "../message-system/index.js";
import { DataDictionary } from "../message-system/index.js";
import { mapVSCodeHTMLAndDataDictionaryToDataDictionary } from "../data-utilities/mapping.vscode-html-languageservice.js";
import {
    findMonacoEditorHTMLPositionByDictionaryId,
    mapDataDictionaryToMonacoEditorHTML,
} from "../data-utilities/monaco.js";
import {
    MessageSystemService,
    MessageSystemServiceConfig,
} from "./message-system.service.js";
import {
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
} from "./monaco-adapter.service-action.js";
import {
    findDictionaryIdParents,
    findUpdatedDictionaryId,
} from "./monaco-adapter.service.utilities.js";

export type actionCallback = () => void;

/**
 * @alpha
 */
export const monacoAdapterId: string = "design-to-code::monaco-adapter-service";

/**
 *
 * @alpha
 * @remarks
 * A MessageSystemService for the Monaco Editor.
 */
export class MonacoAdapter extends MessageSystemService<
    MonacoAdapterActionCallbackConfig,
    object
> {
    private monacoModelValue: string[];
    private schemaDictionary: SchemaDictionary;
    private dataDictionary: DataDictionary<unknown>;
    private dictionaryId: string;

    constructor(config: MessageSystemServiceConfig<MonacoAdapterActionCallbackConfig>) {
        super();

        this.registerMessageSystem(config);
        this.addConfigToActions();
    }

    /**
     * Handles messages from the message system
     */
    handleMessageSystem = (e: MessageEvent): void => {
        if (
            e.data.type !== MessageSystemType.custom &&
            e.data.options?.originatorId !== monacoAdapterId
        ) {
            this.dictionaryId = e.data.activeDictionaryId;
            this.dataDictionary = e.data.dataDictionary;
            this.schemaDictionary = e.data.schemaDictionary;

            if (e.data.options?.originatorId !== monacoAdapterId) {
                this.monacoModelValue = [
                    mapDataDictionaryToMonacoEditorHTML(
                        e.data.dataDictionary,
                        e.data.schemaDictionary
                    ),
                ];
                this.registeredActions.forEach((action: MonacoAdapterAction) => {
                    if (action.matches(e.data.type)) {
                        action.invoke();
                    }
                });
            }
        }
    };

    /**
     * Gets the action config
     */
    getActionConfig = (
        messageSystemType: MessageSystemType
    ): MonacoAdapterActionCallbackConfig => {
        return {
            getMonacoModelValue: this.getMonacoModelValue,
            updateMonacoModelValue: this.updateMonacoModelValue,
            updateMonacoModelPosition: this.updateMonacoModelPosition,
            messageSystemType,
        };
    };

    /**
     * Adds all config options to registered actions
     */
    private addConfigToActions(): void {
        this.registeredActions.forEach((registeredAction: MonacoAdapterAction) => {
            registeredAction.addConfig({
                getMonacoModelValue: this.getMonacoModelValue,
                updateMonacoModelValue: this.updateMonacoModelValue,
                updateMonacoModelPosition: this.updateMonacoModelPosition,
                messageSystemType: registeredAction.getMessageSystemType(),
            });
        });
    }

    /**
     * Retrieve the Monaco Model value
     */
    private getMonacoModelValue = (): string[] => {
        return this.monacoModelValue;
    };

    /**
     * Determine the dictionary id
     */
    private updateDictionaryIdAndNavigationConfigIdFromDataDictionary = (
        newDataDictionary: DataDictionary<unknown>
    ): void => {
        this.dictionaryId = findUpdatedDictionaryId(
            findDictionaryIdParents(this.dictionaryId, this.dataDictionary),
            newDataDictionary
        );
        this.dataDictionary = newDataDictionary;
    };

    /**
     * Update the Monaco Model value
     */
    private updateMonacoModelValue = (value: string[], isExternal: boolean): void => {
        /**
         * Normalize values by converting all new lines into an array
         * and remove the leading spaces
         */
        this.monacoModelValue = value.join("").split("\n");

        if (!isExternal) {
            const dataDictionary = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                this.monacoModelValue
                    .map((value: string): string => {
                        return value.replace(/^\s+/g, ""); // replace leading spaces on each line
                    })
                    .join("")
                    .replace(/\n/g, ""),
                "text",
                this.dataDictionary,
                this.schemaDictionary
            );

            this.updateDictionaryIdAndNavigationConfigIdFromDataDictionary(
                dataDictionary
            );

            this.messageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary,
                schemaDictionary: this.schemaDictionary,
                options: {
                    originatorId: monacoAdapterId,
                },
                dictionaryId: this.dictionaryId,
            } as InitializeMessageIncoming);
        }
    };

    /**
     * Get the position inside the monaco model by dictionary id
     */
    private updateMonacoModelPosition = (dictionaryId?: string): IPosition => {
        return findMonacoEditorHTMLPositionByDictionaryId(
            typeof dictionaryId === "string" ? dictionaryId : this.dictionaryId,
            this.dataDictionary,
            this.schemaDictionary,
            this.monacoModelValue
        );
    };
}

export { MonacoAdapterAction, MonacoAdapterActionCallbackConfig };
