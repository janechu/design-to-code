import { MessageSystem } from "../../../src";
import MessageSystemWorker from "worker-loader!../../../dist/message-system.min.js";
import dataDictionaryConfig from "./data-dictionary-config.js";
import schemaDictionary from "./schema-dictionary.js";
import * as DTCForm from "../../../src/web-components/form/form.define.js";
import * as DTCArrayControl from "../../../src/web-components/form/controls/array/control.array.define.js";
import * as DTCButtonControl from "../../../src/web-components/form/controls/button/control.button.define.js";
import * as DTCCheckboxControl from "../../../src/web-components/form/controls/checkbox/control.checkbox.define.js";
import * as DTCDisplayControl from "../../../src/web-components/form/controls/display/control.display.define.js";
import * as DTCNumberFieldControl from "../../../src/web-components/form/controls/number-field/control.number-field.define.js";
import * as DTCSectionLinkControl from "../../../src/web-components/form/controls/section-link/control.section-link.define.js";
import * as DTCSelectControl from "../../../src/web-components/form/controls/select/control.select.define.js";
import * as DTCTextareaControl from "../../../src/web-components/form/controls/textarea/control.textarea.define.js";
import type { Form } from "../../../src/web-components/form/form";
import { MessageSystemType, MessageSystemDataTypeAction } from "../../../src/index.js";

// tree-shaking
DTCForm;
DTCArrayControl;
DTCButtonControl;
DTCCheckboxControl;
DTCDisplayControl;
DTCNumberFieldControl;
DTCSectionLinkControl;
DTCSelectControl;
DTCTextareaControl;

const fastMessageSystemWorker = new MessageSystemWorker();
let fastMessageSystem: MessageSystem;

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig as any,
        schemaDictionary,
    });
}

const form = document.getElementById("form");
const dataDisplay = document.getElementById("data");
const reset: HTMLButtonElement = document.getElementById("reset") as HTMLButtonElement;
reset.addEventListener("click", () => {
    fastMessageSystem.postMessage({
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.update,
        dataLocation: "foo",
        data: "foobar",
    });
});

(form as Form).messageSystem = fastMessageSystem;

function handleMessageSystem(e: MessageEvent): void {
    switch (e.data.type) {
        case MessageSystemType.initialize:
            if (e.data.data && e.data.navigation) {
                dataDisplay.textContent = JSON.stringify(e.data.data, null, 2);
            }
        case MessageSystemType.data:
            if (e.data.data) {
                dataDisplay.textContent = JSON.stringify(e.data.data, null, 2);
            }
    }
}

fastMessageSystem.add({
    onMessage: handleMessageSystem,
});
