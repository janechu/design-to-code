import { html, slotted, ViewTemplate } from "@microsoft/fast-element";
import dtcClassName from "../style/class-names.js";
import { File } from "./file.js";

/**
 * The template for the file component.
 * @public
 */
export const fileTemplate: ViewTemplate<File> = html`
    <template>
        <div class="root" part="root">
            <link rel="stylesheet" href="${x => x.commonInputStylesheet}" />
            <link rel="stylesheet" href="${x => x.commonDefaultFontStylesheet}" />
            <link rel="stylesheet" href="${x => x.controlButtonStylesheet}" />
            <button
                class="${x => {
                    return x.disabled
                        ? `${dtcClassName.commonInput} ${dtcClassName.commonDefaultFont} ${dtcClassName.buttonControl} ${dtcClassName.buttonControl__disabled}`
                        : `${dtcClassName.commonInput} ${dtcClassName.commonDefaultFont} ${dtcClassName.buttonControl}`;
                }}"
                ?disabled="${x => x.disabled}"
                @click="${x => x.handleClick()}"
            >
                <slot></slot>
            </button>
        </div>
        <slot name="action" ${slotted("action")}></slot>
    </template>
`;
