import { html } from "@microsoft/fast-element";
import { GuidanceDocument } from "./guidance-document.js";

export const guidanceDocumentTemplate = html<GuidanceDocument>`
    <article class="root ${x => x.class}">
        <slot></slot>
    </article>
`;
