import { html, repeat, when } from "@microsoft/fast-element";
import { AjvValidatorMessages } from "./ajv-validator-messages.js";

export const ajvValidatorMessagesTemplate = html<AjvValidatorMessages>`
    <template>
        <div
            class="root${x => (x.errors.length > 0 ? " root-error" : "")}${x =>
                x.errors.length === 0 && x.showSuccess ? " root-success" : ""}"
            part="root"
        >
            ${repeat(
                x => x.errors,
                html`
                    <a class="error" @click=${(x, c) => c.parent.handleMessageClick(x)}>
                        ${x => x.invalidMessage}
                    </a>
                `
            )}
            ${when(
                x => x.errors.length === 0 && x.showSuccess,
                html`
                    <span class="success">
                        No errors found. JSON validates against the schema
                    </span>
                `
            )}
        </div>
    </template>
`;
