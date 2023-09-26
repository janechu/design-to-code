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
const showSuccess: HTMLButtonElement = document.getElementById(
    "showSuccess"
) as HTMLButtonElement;

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: [
            {
                root: {
                    schemaId: "root",
                    data: {},
                },
            },
            "root",
        ],
        schemaDictionary: {
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
        },
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

    showSuccess.addEventListener("click", () => {
        ajvValidatorMessages.setAttribute("show-success", "");
    });
}
