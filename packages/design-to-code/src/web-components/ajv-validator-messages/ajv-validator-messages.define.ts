import { ajvValidatorMessagesTemplate } from "./ajv-validator-messages.template.js";
import { ajvValidatorMessagesStyles } from "./ajv-validator-messages.styles.js";
import { AjvValidatorMessages } from "./ajv-validator-messages.js";

AjvValidatorMessages.define({
    name: "dtc-ajv-validator-messages",
    template: ajvValidatorMessagesTemplate,
    styles: ajvValidatorMessagesStyles,
});
