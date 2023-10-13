import { html, repeat, slotted, when } from "@microsoft/fast-element";
import { Guidance } from "./guidance.js";

export const guidanceTemplate = html<Guidance>`
    <div class="root">
        <div class="list">
            <div class="filter">
                <label for="filter">Filter</label>
                <input
                    id="filter"
                    type="text"
                    @input="${(x, c) => x.handleDocumentFilter(c.event as InputEvent)}"
                    :value=${x => x.filterText}
                />
            </div>
            <ul
                class="${x =>
                    x.documents.length !== x.filteredDocuments.length ? " filtered" : ""}"
            >
                ${repeat(
                    x => x.filteredDocuments,
                    html`
                        <li
                            class="${(x, c) =>
                                c.parent.activeDocument?.title === x.title
                                    ? "active"
                                    : ""}"
                        >
                            <a
                                class="title"
                                @click=${(x, c) => c.parent.handleDocumentClick(x)}
                            >
                                ${x => x.title}
                            </a>
                        </li>
                    `
                )}
            </ul>
        </div>
        <div class="document">
            ${when(
                x => x.activeDocument === null,
                html`
                    <span class="no-active">No document selected</span>
                `
            )}
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </div>
    </div>
`;
