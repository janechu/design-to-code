import * as AjvValidatorMessagesWC from "../../../src/web-components/ajv-validator-messages/ajv-validator-messages.define.js";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../../src";
import MessageSystemWorker from "worker-loader!../../../dist/message-system.min.js";
import { AjvValidatorMessages } from "../../../src/web-components/ajv-validator-messages/ajv-validator-messages.js";
import { AjvValidator } from "../../../src/index.js";

// tree-shaking
AjvValidatorMessagesWC;

const fastMessageSystemWorker = new MessageSystemWorker();
let fastMessageSystem: MessageSystem;
const ajvValidatorMessages: AjvValidatorMessages = document.getElementById(
    "validator"
) as AjvValidatorMessages;
const activeNavigationConfigIdInput: HTMLInputElement = document.getElementById(
    "activeNavigationConfigIdInput"
) as HTMLInputElement;
const setValidData: HTMLButtonElement = document.getElementById(
    "setValidData"
) as HTMLButtonElement;
const setInvalidSchema: HTMLButtonElement = document.getElementById(
    "setInvalidSchema"
) as HTMLButtonElement;
const showSuccess: HTMLButtonElement = document.getElementById(
    "showSuccess"
) as HTMLButtonElement;

if ((window as any).Worker) {
    const initialInvalidDataDictionary = [
        {
            root: {
                schemaId: "root",
                data: {},
            },
        },
        "root",
    ];
    const initialSchemaDictionary = {
        root: {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: "root",
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            required: ["foo"],
        },
        error: {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: "error",
            type: "error",
        },
    };
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: initialInvalidDataDictionary as any,
        schemaDictionary: initialSchemaDictionary,
    });
    ajvValidatorMessages.messageSystem = fastMessageSystem;
    new AjvValidator({
        messageSystem: fastMessageSystem,
    });

    fastMessageSystem.add({
        onMessage: e => {
            if (e.data.type === MessageSystemType.navigation) {
                activeNavigationConfigIdInput.value = e.data.activeNavigationConfigId;
            }
        },
    });

    setValidData.addEventListener("click", () => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            data: "bar",
            dataLocation: "foo",
        });
    });

    setInvalidSchema.addEventListener("click", () => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.initialize,
            dataDictionary: [
                {
                    root: {
                        schemaId: "error",
                        data: {},
                    },
                },
                "root",
            ],
            schemaDictionary: initialSchemaDictionary,
        });
    });

    showSuccess.addEventListener("click", () => {
        ajvValidatorMessages.setAttribute("show-success", "");
    });
}
